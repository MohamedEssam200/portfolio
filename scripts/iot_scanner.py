#!/usr/bin/env python3
"""
IoT Security Scanner - Comprehensive IoT Device Discovery and Security Assessment
Advanced scanning engine for identifying and analyzing IoT devices on the network
"""

import socket
import struct
import threading
import json
import time
import sys
import subprocess
import re
import requests
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
import nmap
import scapy.all as scapy
from scapy.layers.l2 import ARP, Ether
from scapy.layers.inet import IP, TCP, UDP, ICMP
import argparse

class IoTScanner:
    def __init__(self):
        self.devices = []
        self.vulnerability_db = self.load_vulnerability_database()
        self.device_fingerprints = self.load_device_fingerprints()
        self.scan_results = {
            'total_devices': 0,
            'vulnerable_devices': 0,
            'critical_vulns': 0,
            'high_vulns': 0,
            'medium_vulns': 0,
            'low_vulns': 0,
            'scan_duration': 0
        }
        
    def load_vulnerability_database(self):
        """Load known IoT vulnerabilities database"""
        return {
            'default_credentials': {
                'admin:admin': ['router', 'camera', 'nvr'],
                'admin:password': ['router', 'switch'],
                'admin:': ['camera', 'printer'],
                'root:root': ['camera', 'router'],
                'user:user': ['camera', 'thermostat'],
                '888888:888888': ['camera'],
                '123456:123456': ['camera', 'dvr']
            },
            'known_exploits': {
                'CVE-2021-35394': {
                    'description': 'Realtek SDK vulnerability in multiple IoT devices',
                    'severity': 'critical',
                    'affected_ports': [80, 443, 8080],
                    'detection': r'Server:.*Realtek'
                },
                'CVE-2020-25506': {
                    'description': 'D-Link router command injection',
                    'severity': 'high',
                    'affected_ports': [80, 8080],
                    'detection': r'D-Link.*Router'
                },
                'CVE-2019-7256': {
                    'description': 'Hikvision IP camera authentication bypass',
                    'severity': 'critical',
                    'affected_ports': [80, 8000],
                    'detection': r'Hikvision.*Camera'
                }
            },
            'weak_services': {
                'telnet': {'port': 23, 'severity': 'high'},
                'ftp': {'port': 21, 'severity': 'medium'},
                'http': {'port': 80, 'severity': 'low'},
                'snmp': {'port': 161, 'severity': 'medium'},
                'upnp': {'port': 1900, 'severity': 'medium'}
            }
        }
    
    def load_device_fingerprints(self):
        """Load device fingerprinting patterns"""
        return {
            'manufacturers': {
                r'00:0C:29': 'VMware',
                r'00:50:56': 'VMware',
                r'08:00:27': 'VirtualBox',
                r'B8:27:EB': 'Raspberry Pi',
                r'DC:A6:32': 'Raspberry Pi',
                r'E4:5F:01': 'Raspberry Pi',
                r'00:1B:44': 'Cisco',
                r'00:26:99': 'Cisco',
                r'28:6E:D4': 'Apple',
                r'3C:07:54': 'Apple',
                r'00:E0:4C': 'Realtek',
                r'52:54:00': 'QEMU'
            },
            'device_types': {
                'camera': {
                    'ports': [80, 554, 8000, 8080, 9000],
                    'services': ['rtsp', 'http'],
                    'banners': [r'IP Camera', r'Network Camera', r'RTSP', r'Hikvision', r'Dahua']
                },
                'router': {
                    'ports': [22, 23, 53, 80, 443, 8080],
                    'services': ['ssh', 'telnet', 'http', 'https'],
                    'banners': [r'Router', r'Gateway', r'OpenWrt', r'DD-WRT']
                },
                'printer': {
                    'ports': [80, 443, 515, 631, 9100],
                    'services': ['http', 'ipp', 'lpd'],
                    'banners': [r'Printer', r'HP', r'Canon', r'Epson']
                },
                'smart_tv': {
                    'ports': [80, 443, 8080, 9197],
                    'services': ['http', 'upnp'],
                    'banners': [r'Smart TV', r'Samsung', r'LG', r'Sony']
                },
                'thermostat': {
                    'ports': [80, 443, 8883],
                    'services': ['http', 'mqtt'],
                    'banners': [r'Thermostat', r'Nest', r'Honeywell']
                }
            }
        }
    
    def discover_devices(self, network_range):
        """Discover devices on the network using ARP scanning"""
        print(f"[+] Discovering devices on {network_range}")
        
        # Create ARP request
        arp_request = ARP(pdst=network_range)
        broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")
        arp_request_broadcast = broadcast / arp_request
        
        # Send request and receive response
        answered_list = scapy.srp(arp_request_broadcast, timeout=2, verbose=False)[0]
        
        devices = []
        for element in answered_list:
            device = {
                'ip': element[1].psrc,
                'mac': element[1].hwsrc,
                'manufacturer': self.identify_manufacturer(element[1].hwsrc),
                'timestamp': datetime.now().isoformat()
            }
            devices.append(device)
            
        print(f"[+] Discovered {len(devices)} devices")
        return devices
    
    def identify_manufacturer(self, mac_address):
        """Identify device manufacturer from MAC address"""
        mac_prefix = mac_address[:8].upper()
        
        for pattern, manufacturer in self.device_fingerprints['manufacturers'].items():
            if re.match(pattern.replace(':', ''), mac_address.replace(':', '')):
                return manufacturer
                
        return "Unknown"
    
    def port_scan(self, ip, ports=None, scan_type='syn'):
        """Perform port scan on target device"""
        if ports is None:
            # Common IoT ports
            ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 515, 554, 631, 993, 995, 
                    1900, 5000, 8000, 8080, 8443, 8883, 9000, 9100]
        
        nm = nmap.PortScanner()
        
        try:
            if scan_type == 'stealth':
                scan_args = '-sS -T2'
            elif scan_type == 'deep':
                scan_args = '-sS -sV -O -T4'
            else:  # quick
                scan_args = '-sS -T4'
                
            result = nm.scan(ip, ','.join(map(str, ports)), arguments=scan_args)
            
            if ip in result['scan']:
                host_info = result['scan'][ip]
                return {
                    'open_ports': [port for port in host_info.get('tcp', {}) 
                                 if host_info['tcp'][port]['state'] == 'open'],
                    'services': self.extract_services(host_info.get('tcp', {})),
                    'os_info': host_info.get('osmatch', []),
                    'status': host_info.get('status', {}).get('state', 'unknown')
                }
        except Exception as e:
            print(f"[-] Error scanning {ip}: {e}")
            
        return {'open_ports': [], 'services': [], 'os_info': [], 'status': 'unknown'}
    
    def extract_services(self, tcp_info):
        """Extract service information from nmap results"""
        services = []
        
        for port, info in tcp_info.items():
            if info['state'] == 'open':
                service = {
                    'port': port,
                    'protocol': 'tcp',
                    'service': info.get('name', 'unknown'),
                    'version': info.get('version', ''),
                    'product': info.get('product', ''),
                    'banner': f"{info.get('product', '')} {info.get('version', '')}".strip()
                }
                services.append(service)
                
        return services
    
    def identify_device_type(self, services, banners):
        """Identify device type based on services and banners"""
        all_text = ' '.join(banners).lower()
        
        for device_type, patterns in self.device_fingerprints['device_types'].items():
            for banner_pattern in patterns['banners']:
                if re.search(banner_pattern.lower(), all_text):
                    return device_type
                    
        # Fallback to port-based detection
        open_ports = [s['port'] for s in services]
        
        if 554 in open_ports or any('rtsp' in s['service'].lower() for s in services):
            return 'camera'
        elif 631 in open_ports or 9100 in open_ports:
            return 'printer'
        elif set([22, 53, 80]).issubset(open_ports):
            return 'router'
        elif 1900 in open_ports:
            return 'smart_device'
            
        return 'unknown'
    
    def check_default_credentials(self, ip, port, service):
        """Check for default credentials"""
        vulnerabilities = []
        
        if service.lower() in ['http', 'https']:
            for creds, device_types in self.vulnerability_db['default_credentials'].items():
                username, password = creds.split(':')
                
                try:
                    protocol = 'https' if port == 443 else 'http'
                    url = f"{protocol}://{ip}:{port}/login"
                    
                    response = requests.post(
                        url,
                        data={'username': username, 'password': password},
                        timeout=5,
                        verify=False
                    )
                    
                    if response.status_code == 200 and 'dashboard' in response.text.lower():
                        vulnerabilities.append({
                            'type': 'Default Credentials',
                            'severity': 'critical',
                            'description': f'Default credentials {username}:{password} accepted',
                            'solution': 'Change default credentials immediately',
                            'exploitable': True
                        })
                        
                except Exception:
                    pass
                    
        return vulnerabilities
    
    def check_known_exploits(self, services, device_info):
        """Check for known exploits and vulnerabilities"""
        vulnerabilities = []
        
        for service in services:
            banner = service.get('banner', '').lower()
            
            for cve, exploit_info in self.vulnerability_db['known_exploits'].items():
                if re.search(exploit_info['detection'].lower(), banner):
                    vulnerabilities.append({
                        'type': 'Known Exploit',
                        'severity': exploit_info['severity'],
                        'description': exploit_info['description'],
                        'cve': cve,
                        'solution': 'Update firmware to latest version',
                        'exploitable': True
                    })
        
        return vulnerabilities
    
    def check_weak_services(self, services):
        """Check for weak or insecure services"""
        vulnerabilities = []
        
        for service in services:
            service_name = service['service'].lower()
            port = service['port']
            
            if service_name in self.vulnerability_db['weak_services']:
                weak_service = self.vulnerability_db['weak_services'][service_name]
                
                vulnerabilities.append({
                    'type': 'Insecure Service',
                    'severity': weak_service['severity'],
                    'description': f'{service_name.upper()} service running on port {port}',
                    'solution': f'Disable {service_name.upper()} or use secure alternatives',
                    'exploitable': service_name in ['telnet', 'ftp']
                })
                
        return vulnerabilities
    
    def calculate_security_score(self, vulnerabilities, services, device_info):
        """Calculate security score based on vulnerabilities and configuration"""
        base_score = 100
        
        # Deduct points for vulnerabilities
        for vuln in vulnerabilities:
            if vuln['severity'] == 'critical':
                base_score -= 30
            elif vuln['severity'] == 'high':
                base_score -= 20
            elif vuln['severity'] == 'medium':
                base_score -= 10
            elif vuln['severity'] == 'low':
                base_score -= 5
        
        # Deduct points for insecure services
        insecure_services = ['telnet', 'ftp', 'http']
        for service in services:
            if service['service'].lower() in insecure_services:
                base_score -= 5
        
        # Bonus points for secure services
        secure_services = ['https', 'ssh', 'sftp']
        for service in services:
            if service['service'].lower() in secure_services:
                base_score += 2
        
        return max(0, min(100, base_score))
    
    def analyze_device(self, device, scan_type='quick'):
        """Perform comprehensive security analysis on a device"""
        print(f"[+] Analyzing device {device['ip']}")
        
        # Port scan
        scan_result = self.port_scan(device['ip'], scan_type=scan_type)
        
        # Identify device type
        banners = [s.get('banner', '') for s in scan_result['services']]
        device_type = self.identify_device_type(scan_result['services'], banners)
        
        # Security assessment
        vulnerabilities = []
        
        # Check for default credentials
        for service in scan_result['services']:
            if service['service'].lower() in ['http', 'https']:
                vulns = self.check_default_credentials(
                    device['ip'], service['port'], service['service']
                )
                vulnerabilities.extend(vulns)
        
        # Check for known exploits
        vulns = self.check_known_exploits(scan_result['services'], device)
        vulnerabilities.extend(vulns)
        
        # Check for weak services
        vulns = self.check_weak_services(scan_result['services'])
        vulnerabilities.extend(vulns)
        
        # Calculate security score
        security_score = self.calculate_security_score(
            vulnerabilities, scan_result['services'], device
        )
        
        # Determine encryption and authentication levels
        encryption = self.assess_encryption(scan_result['services'])
        authentication = self.assess_authentication(scan_result['services'], vulnerabilities)
        
        analyzed_device = {
            'id': f"{device['ip'].replace('.', '_')}_{int(time.time())}",
            'name': f"{device_type.title()} - {device['ip']}",
            'ip': device['ip'],
            'mac': device['mac'],
            'manufacturer': device['manufacturer'],
            'device_type': device_type,
            'model': 'Unknown',
            'firmware': 'Unknown',
            'last_seen': datetime.now().isoformat(),
            'status': scan_result['status'],
            'open_ports': scan_result['open_ports'],
            'services': scan_result['services'],
            'vulnerabilities': vulnerabilities,
            'security_score': security_score,
            'encryption': encryption,
            'authentication': authentication,
            'os_info': scan_result['os_info']
        }
        
        return analyzed_device
    
    def assess_encryption(self, services):
        """Assess encryption level based on services"""
        has_https = any(s['service'].lower() == 'https' for s in services)
        has_ssh = any(s['service'].lower() == 'ssh' for s in services)
        has_http = any(s['service'].lower() == 'http' for s in services)
        has_telnet = any(s['service'].lower() == 'telnet' for s in services)
        
        if (has_https or has_ssh) and not (has_http or has_telnet):
            return 'strong'
        elif has_https or has_ssh:
            return 'weak'
        else:
            return 'none'
    
    def assess_authentication(self, services, vulnerabilities):
        """Assess authentication level"""
        has_default_creds = any(v['type'] == 'Default Credentials' for v in vulnerabilities)
        
        if has_default_creds:
            return 'default'
        
        # Simple heuristic based on services
        secure_services = ['https', 'ssh']
        has_secure = any(s['service'].lower() in secure_services for s in services)
        
        if has_secure:
            return 'strong'
        else:
            return 'weak'
    
    def scan_network(self, network_range, scan_type='quick', max_threads=10):
        """Perform comprehensive IoT security scan"""
        start_time = time.time()
        
        print(f"[+] Starting IoT security scan on {network_range}")
        print(f"[+] Scan type: {scan_type}")
        
        # Discover devices
        discovered_devices = self.discover_devices(network_range)
        
        if not discovered_devices:
            print("[-] No devices discovered")
            return []
        
        # Analyze devices in parallel
        analyzed_devices = []
        
        with ThreadPoolExecutor(max_workers=max_threads) as executor:
            future_to_device = {
                executor.submit(self.analyze_device, device, scan_type): device 
                for device in discovered_devices
            }
            
            for future in as_completed(future_to_device):
                try:
                    analyzed_device = future.result()
                    analyzed_devices.append(analyzed_device)
                    print(f"[+] Completed analysis of {analyzed_device['ip']}")
                except Exception as e:
                    device = future_to_device[future]
                    print(f"[-] Error analyzing {device['ip']}: {e}")
        
        # Update scan results
        self.devices = analyzed_devices
        self.scan_results = self.calculate_scan_results(analyzed_devices)
        self.scan_results['scan_duration'] = time.time() - start_time
        
        print(f"\n[+] Scan completed in {self.scan_results['scan_duration']:.2f} seconds")
        print(f"[+] Found {len(analyzed_devices)} devices")
        print(f"[+] {self.scan_results['vulnerable_devices']} devices have vulnerabilities")
        
        return analyzed_devices
    
    def calculate_scan_results(self, devices):
        """Calculate scan statistics"""
        results = {
            'total_devices': len(devices),
            'vulnerable_devices': len([d for d in devices if d['vulnerabilities']]),
            'critical_vulns': sum(len([v for v in d['vulnerabilities'] if v['severity'] == 'critical']) for d in devices),
            'high_vulns': sum(len([v for v in d['vulnerabilities'] if v['severity'] == 'high']) for d in devices),
            'medium_vulns': sum(len([v for v in d['vulnerabilities'] if v['severity'] == 'medium']) for d in devices),
            'low_vulns': sum(len([v for v in d['vulnerabilities'] if v['severity'] == 'low']) for d in devices),
            'average_security_score': sum(d['security_score'] for d in devices) / len(devices) if devices else 0
        }
        
        return results
    
    def export_results(self, filename=None):
        """Export scan results to JSON file"""
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"iot_security_scan_{timestamp}.json"
        
        export_data = {
            'scan_info': {
                'timestamp': datetime.now().isoformat(),
                'scan_results': self.scan_results
            },
            'devices': self.devices
        }
        
        with open(filename, 'w') as f:
            json.dump(export_data, f, indent=2)
        
        print(f"[+] Results exported to {filename}")
        return filename

def main():
    parser = argparse.ArgumentParser(description='IoT Security Scanner')
    parser.add_argument('network', help='Network range to scan (e.g., 192.168.1.0/24)')
    parser.add_argument('--scan-type', choices=['quick', 'deep', 'stealth'], 
                       default='quick', help='Scan type')
    parser.add_argument('--threads', type=int, default=10, 
                       help='Number of threads for parallel scanning')
    parser.add_argument('--output', help='Output filename for results')
    
    args = parser.parse_args()
    
    scanner = IoTScanner()
    
    try:
        devices = scanner.scan_network(
            args.network, 
            scan_type=args.scan_type,
            max_threads=args.threads
        )
        
        # Export results
        filename = scanner.export_results(args.output)
        
        # Print summary
        print("\n" + "="*60)
        print("IOT SECURITY SCAN SUMMARY")
        print("="*60)
        print(f"Total Devices: {scanner.scan_results['total_devices']}")
        print(f"Vulnerable Devices: {scanner.scan_results['vulnerable_devices']}")
        print(f"Critical Vulnerabilities: {scanner.scan_results['critical_vulns']}")
        print(f"High Vulnerabilities: {scanner.scan_results['high_vulns']}")
        print(f"Medium Vulnerabilities: {scanner.scan_results['medium_vulns']}")
        print(f"Low Vulnerabilities: {scanner.scan_results['low_vulns']}")
        print(f"Average Security Score: {scanner.scan_results['average_security_score']:.1f}/100")
        print(f"Scan Duration: {scanner.scan_results['scan_duration']:.2f} seconds")
        print(f"Report File: {filename}")
        
    except KeyboardInterrupt:
        print("\n[+] Scan interrupted by user")
    except Exception as e:
        print(f"[-] Error during scan: {e}")

if __name__ == "__main__":
    main()
