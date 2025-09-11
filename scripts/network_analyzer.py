#!/usr/bin/env python3
"""
Network Analyzer - Advanced Packet Capture and Analysis Tool
Real-time network monitoring with threat detection and deep packet inspection
"""

import socket
import struct
import threading
import json
import time
import sys
from datetime import datetime
from collections import defaultdict, deque
import subprocess
import re

class PacketAnalyzer:
    def __init__(self):
        self.packets = deque(maxlen=1000)  # Store last 1000 packets
        self.stats = {
            'total_packets': 0,
            'total_bytes': 0,
            'threats_detected': 0,
            'protocols': defaultdict(int),
            'connections': defaultdict(int),
            'bandwidth_usage': deque(maxlen=60)  # Last 60 seconds
        }
        self.threat_signatures = self.load_threat_signatures()
        self.monitoring = False
        
    def load_threat_signatures(self):
        """Load threat detection signatures"""
        return {
            'port_scan': {
                'pattern': r'SYN.*RST|SYN.*FIN',
                'description': 'Port scan attempt detected',
                'severity': 'High'
            },
            'dos_attack': {
                'pattern': r'ICMP.*flood|UDP.*flood',
                'description': 'Potential DoS attack',
                'severity': 'High'
            },
            'suspicious_dns': {
                'pattern': r'DNS.*[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}',
                'description': 'Suspicious DNS query to IP address',
                'severity': 'Medium'
            },
            'unencrypted_ftp': {
                'pattern': r'FTP.*USER|FTP.*PASS',
                'description': 'Unencrypted FTP credentials',
                'severity': 'Medium'
            },
            'malware_c2': {
                'pattern': r'POST.*\/[a-f0-9]{32}|GET.*\/[a-f0-9]{32}',
                'description': 'Potential malware C2 communication',
                'severity': 'High'
            }
        }
    
    def parse_ethernet_header(self, packet):
        """Parse Ethernet header"""
        eth_header = struct.unpack('!6s6sH', packet[:14])
        eth_protocol = socket.ntohs(eth_header[2])
        return eth_protocol, packet[14:]
    
    def parse_ip_header(self, packet):
        """Parse IP header"""
        ip_header = struct.unpack('!BBHHHBBH4s4s', packet[:20])
        
        version_ihl = ip_header[0]
        version = version_ihl >> 4
        ihl = version_ihl & 0xF
        iph_length = ihl * 4
        
        ttl = ip_header[5]
        protocol = ip_header[6]
        s_addr = socket.inet_ntoa(ip_header[8])
        d_addr = socket.inet_ntoa(ip_header[9])
        
        return {
            'version': version,
            'header_length': iph_length,
            'ttl': ttl,
            'protocol': protocol,
            'source': s_addr,
            'destination': d_addr
        }, packet[iph_length:]
    
    def parse_tcp_header(self, packet):
        """Parse TCP header"""
        tcp_header = struct.unpack('!HHLLBBHHH', packet[:20])
        
        source_port = tcp_header[0]
        dest_port = tcp_header[1]
        sequence = tcp_header[2]
        acknowledgement = tcp_header[3]
        doff_reserved = tcp_header[4]
        tcph_length = doff_reserved >> 4
        
        flags = tcp_header[5]
        flag_urg = (flags & 32) >> 5
        flag_ack = (flags & 16) >> 4
        flag_psh = (flags & 8) >> 3
        flag_rst = (flags & 4) >> 2
        flag_syn = (flags & 2) >> 1
        flag_fin = flags & 1
        
        return {
            'source_port': source_port,
            'dest_port': dest_port,
            'sequence': sequence,
            'acknowledgement': acknowledgement,
            'flags': {
                'urg': flag_urg,
                'ack': flag_ack,
                'psh': flag_psh,
                'rst': flag_rst,
                'syn': flag_syn,
                'fin': flag_fin
            }
        }, packet[tcph_length * 4:]
    
    def parse_udp_header(self, packet):
        """Parse UDP header"""
        udp_header = struct.unpack('!HHHH', packet[:8])
        
        source_port = udp_header[0]
        dest_port = udp_header[1]
        length = udp_header[2]
        checksum = udp_header[3]
        
        return {
            'source_port': source_port,
            'dest_port': dest_port,
            'length': length,
            'checksum': checksum
        }, packet[8:]
    
    def detect_protocol(self, ip_info, transport_info):
        """Detect application layer protocol"""
        if 'source_port' not in transport_info:
            return 'ICMP'
        
        port = transport_info.get('dest_port', 0)
        
        protocol_map = {
            20: 'FTP-DATA',
            21: 'FTP',
            22: 'SSH',
            23: 'TELNET',
            25: 'SMTP',
            53: 'DNS',
            67: 'DHCP',
            68: 'DHCP',
            80: 'HTTP',
            110: 'POP3',
            143: 'IMAP',
            443: 'HTTPS',
            993: 'IMAPS',
            995: 'POP3S'
        }
        
        return protocol_map.get(port, f'TCP/{port}' if ip_info['protocol'] == 6 else f'UDP/{port}')
    
    def analyze_threat(self, packet_info, payload):
        """Analyze packet for potential threats"""
        threats = []
        
        # Convert payload to string for pattern matching
        try:
            payload_str = payload.decode('utf-8', errors='ignore')
        except:
            payload_str = str(payload)
        
        # Check against threat signatures
        for threat_name, signature in self.threat_signatures.items():
            if re.search(signature['pattern'], payload_str, re.IGNORECASE):
                threats.append({
                    'type': threat_name,
                    'description': signature['description'],
                    'severity': signature['severity']
                })
        
        # Additional heuristic checks
        if packet_info.get('transport_info', {}).get('flags', {}).get('syn') and \
           packet_info.get('transport_info', {}).get('flags', {}).get('rst'):
            threats.append({
                'type': 'port_scan',
                'description': 'SYN-RST pattern indicates port scanning',
                'severity': 'High'
            })
        
        # Check for suspicious port combinations
        dest_port = packet_info.get('transport_info', {}).get('dest_port', 0)
        if dest_port in [1337, 31337, 4444, 5555]:  # Common backdoor ports
            threats.append({
                'type': 'backdoor_port',
                'description': f'Connection to suspicious port {dest_port}',
                'severity': 'High'
            })
        
        return threats
    
    def process_packet(self, packet):
        """Process and analyze a single packet"""
        try:
            packet_size = len(packet)
            timestamp = datetime.now()
            
            # Parse Ethernet header
            eth_protocol, ip_packet = self.parse_ethernet_header(packet)
            
            if eth_protocol != 0x0800:  # Not IPv4
                return None
            
            # Parse IP header
            ip_info, transport_packet = self.parse_ip_header(ip_packet)
            
            # Parse transport layer
            transport_info = {}
            payload = b''
            
            if ip_info['protocol'] == 6:  # TCP
                transport_info, payload = self.parse_tcp_header(transport_packet)
                transport_protocol = 'TCP'
            elif ip_info['protocol'] == 17:  # UDP
                transport_info, payload = self.parse_udp_header(transport_packet)
                transport_protocol = 'UDP'
            else:
                transport_protocol = 'OTHER'
                payload = transport_packet
            
            # Detect application protocol
            app_protocol = self.detect_protocol(ip_info, transport_info)
            
            # Analyze for threats
            packet_info = {
                'ip_info': ip_info,
                'transport_info': transport_info,
                'protocol': app_protocol
            }
            threats = self.analyze_threat(packet_info, payload)
            
            # Create packet record
            packet_record = {
                'id': f"{timestamp.timestamp()}_{self.stats['total_packets']}",
                'timestamp': timestamp.isoformat(),
                'source': ip_info['source'],
                'destination': ip_info['destination'],
                'protocol': app_protocol,
                'transport_protocol': transport_protocol,
                'size': packet_size,
                'threats': threats,
                'threat_level': self.get_max_threat_level(threats),
                'source_port': transport_info.get('source_port', 0),
                'dest_port': transport_info.get('dest_port', 0),
                'flags': transport_info.get('flags', {}),
                'payload_preview': payload[:100].hex() if payload else ''
            }
            
            # Update statistics
            self.update_stats(packet_record)
            
            # Store packet
            self.packets.append(packet_record)
            
            return packet_record
            
        except Exception as e:
            print(f"Error processing packet: {e}")
            return None
    
    def get_max_threat_level(self, threats):
        """Get the maximum threat level from a list of threats"""
        if not threats:
            return 'None'
        
        severity_order = {'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4}
        max_severity = max(threats, key=lambda t: severity_order.get(t['severity'], 0))
        return max_severity['severity']
    
    def update_stats(self, packet_record):
        """Update monitoring statistics"""
        self.stats['total_packets'] += 1
        self.stats['total_bytes'] += packet_record['size']
        
        if packet_record['threats']:
            self.stats['threats_detected'] += 1
        
        self.stats['protocols'][packet_record['protocol']] += 1
        
        connection_key = f"{packet_record['source']}:{packet_record.get('source_port', 0)}"
        self.stats['connections'][connection_key] += 1
        
        # Update bandwidth usage (bytes per second)
        current_time = time.time()
        self.stats['bandwidth_usage'].append({
            'timestamp': current_time,
            'bytes': packet_record['size']
        })
    
    def start_capture(self, interface='eth0', duration=None):
        """Start packet capture"""
        print(f"[+] Starting packet capture on interface {interface}")
        self.monitoring = True
        
        try:
            # Create raw socket
            sock = socket.socket(socket.AF_PACKET, socket.SOCK_RAW, socket.ntohs(0x0003))
            sock.bind((interface, 0))
            
            start_time = time.time()
            
            while self.monitoring:
                if duration and (time.time() - start_time) > duration:
                    break
                
                try:
                    packet, addr = sock.recvfrom(65536)
                    self.process_packet(packet)
                except socket.timeout:
                    continue
                except Exception as e:
                    print(f"Error receiving packet: {e}")
                    continue
                    
        except PermissionError:
            print("[-] Permission denied. Run as root or with CAP_NET_RAW capability")
            return False
        except Exception as e:
            print(f"[-] Error starting capture: {e}")
            return False
        finally:
            self.monitoring = False
            
        return True
    
    def stop_capture(self):
        """Stop packet capture"""
        self.monitoring = False
        print("[+] Packet capture stopped")
    
    def get_statistics(self):
        """Get current monitoring statistics"""
        # Calculate bandwidth
        current_time = time.time()
        recent_bandwidth = [
            entry for entry in self.stats['bandwidth_usage']
            if current_time - entry['timestamp'] <= 60
        ]
        
        bandwidth_bps = sum(entry['bytes'] for entry in recent_bandwidth) / 60 if recent_bandwidth else 0
        
        return {
            'total_packets': self.stats['total_packets'],
            'total_bytes': self.stats['total_bytes'],
            'threats_detected': self.stats['threats_detected'],
            'active_connections': len(self.stats['connections']),
            'bandwidth_bps': bandwidth_bps,
            'top_protocols': dict(sorted(self.stats['protocols'].items(), key=lambda x: x[1], reverse=True)[:10]),
            'monitoring': self.monitoring
        }
    
    def get_recent_packets(self, count=50):
        """Get recent packets"""
        return list(self.packets)[-count:]
    
    def export_packets(self, filename=None):
        """Export captured packets to JSON file"""
        if not filename:
            filename = f"network_capture_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        export_data = {
            'capture_info': {
                'timestamp': datetime.now().isoformat(),
                'total_packets': len(self.packets),
                'statistics': self.get_statistics()
            },
            'packets': list(self.packets)
        }
        
        with open(filename, 'w') as f:
            json.dump(export_data, f, indent=2)
        
        print(f"[+] Exported {len(self.packets)} packets to {filename}")
        return filename

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 network_analyzer.py <command> [options]")
        print("Commands:")
        print("  capture <interface> [duration] - Start packet capture")
        print("  analyze <pcap_file> - Analyze existing capture file")
        print("  monitor - Start real-time monitoring")
        sys.exit(1)
    
    analyzer = PacketAnalyzer()
    command = sys.argv[1]
    
    if command == 'capture':
        interface = sys.argv[2] if len(sys.argv) > 2 else 'eth0'
        duration = int(sys.argv[3]) if len(sys.argv) > 3 else None
        
        print(f"[+] Starting network capture on {interface}")
        if duration:
            print(f"[+] Capture duration: {duration} seconds")
        
        try:
            analyzer.start_capture(interface, duration)
        except KeyboardInterrupt:
            print("\n[+] Capture interrupted by user")
        finally:
            analyzer.stop_capture()
            
        # Export results
        filename = analyzer.export_packets()
        stats = analyzer.get_statistics()
        
        print("\n" + "="*50)
        print("CAPTURE SUMMARY")
        print("="*50)
        print(f"Total Packets: {stats['total_packets']}")
        print(f"Total Bytes: {stats['total_bytes']}")
        print(f"Threats Detected: {stats['threats_detected']}")
        print(f"Active Connections: {stats['active_connections']}")
        print(f"Export File: {filename}")
        
    elif command == 'monitor':
        print("[+] Starting real-time monitoring mode")
        print("[+] Press Ctrl+C to stop")
        
        # Start capture in background thread
        capture_thread = threading.Thread(
            target=analyzer.start_capture,
            args=('eth0', None)
        )
        capture_thread.daemon = True
        capture_thread.start()
        
        try:
            while True:
                time.sleep(5)
                stats = analyzer.get_statistics()
                recent_packets = analyzer.get_recent_packets(10)
                
                # Clear screen and show stats
                print("\033[2J\033[H")  # Clear screen
                print("="*80)
                print("NETWORK ANALYZER - REAL-TIME MONITORING")
                print("="*80)
                print(f"Packets: {stats['total_packets']} | "
                      f"Bytes: {stats['total_bytes']} | "
                      f"Threats: {stats['threats_detected']} | "
                      f"Bandwidth: {stats['bandwidth_bps']:.1f} B/s")
                print("-"*80)
                
                # Show recent packets
                for packet in recent_packets[-5:]:
                    threat_indicator = "⚠️" if packet['threats'] else "✅"
                    print(f"{threat_indicator} {packet['timestamp'][:19]} | "
                          f"{packet['source']:15} → {packet['destination']:15} | "
                          f"{packet['protocol']:8} | {packet['size']:4}B")
                
        except KeyboardInterrupt:
            analyzer.stop_capture()
            print("\n[+] Monitoring stopped")

if __name__ == "__main__":
    main()
