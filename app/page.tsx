"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Code,
  Database,
  Lock,
  Search,
  Wifi,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  CheckCircle,
  Clock,
  Award,
  Zap,
  Globe,
  Smartphone,
  Server,
  Eye,
  MessageSquare,
  Router,
} from "lucide-react"

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-500/30 px-4 py-2 text-sm font-medium">
                  Computer Engineering Student
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="text-white font-bold">Mohamed Essam</span>
                </h1>
                <p className="text-xl lg:text-2xl text-emerald-200 font-medium">Penetration Tester & App Developer</p>
                <p className="text-lg text-white leading-relaxed max-w-2xl">
                  Specializing in cybersecurity, penetration testing, and full-stack development. Building secure
                  applications and identifying vulnerabilities to protect digital assets.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3"
                  onClick={() => (window.location.href = "mailto:mohamedessam15052002@gmail.com")}
                >
                  Contact Me
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-slate-900 px-8 py-3 bg-slate-900/50"
                  onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                >
                  View Projects
                </Button>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-emerald-400/30 shadow-2xl">
                  <img src="/profile.jpg" alt="Mohamed Essam" className="w-full h-full object-cover object-center" />
                </div>
                <div className="absolute -top-4 -right-4 animate-bounce">
                  <div className="bg-emerald-500 rounded-full p-3 shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 animate-bounce delay-300">
                  <div className="bg-teal-500 rounded-full p-3 shadow-lg">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Technical Skills</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Expertise across cybersecurity, development, and engineering domains
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Programming Languages */}
            <Card className="bg-slate-800/50 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="h-5 w-5 text-emerald-400" />
                  Programming Languages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Python</span>
                      <span className="text-emerald-400">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">JavaScript/TypeScript</span>
                      <span className="text-emerald-400">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Java</span>
                      <span className="text-emerald-400">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">C/C++</span>
                      <span className="text-emerald-400">80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cybersecurity Tools */}
            <Card className="bg-slate-800/50 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-400" />
                  Cybersecurity Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="secondary" className="bg-red-500/20 text-red-100 border-red-500/30">
                    Metasploit
                  </Badge>
                  <Badge variant="secondary" className="bg-red-500/20 text-red-100 border-red-500/30">
                    Nmap
                  </Badge>
                  <Badge variant="secondary" className="bg-red-500/20 text-red-100 border-red-500/30">
                    Burp Suite
                  </Badge>
                  <Badge variant="secondary" className="bg-red-500/20 text-red-100 border-red-500/30">
                    Wireshark
                  </Badge>
                  <Badge variant="secondary" className="bg-red-500/20 text-red-100 border-red-500/30">
                    Kali Linux
                  </Badge>
                  <Badge variant="secondary" className="bg-red-500/20 text-red-100 border-red-500/30">
                    OWASP ZAP
                  </Badge>
                  <Badge variant="secondary" className="bg-red-500/20 text-red-100 border-red-500/30">
                    Nessus
                  </Badge>
                  <Badge variant="secondary" className="bg-red-500/20 text-red-100 border-red-500/30">
                    Nikto
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Frameworks & Technologies */}
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  Frameworks & Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    React
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Next.js
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Node.js
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Express
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    MongoDB
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    PostgreSQL
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Docker
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    AWS
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Security Specializations */}
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-400" />
                  Security Specializations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Web App Security</span>
                      <span className="text-purple-400">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Network Security</span>
                      <span className="text-purple-400">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Mobile Security</span>
                      <span className="text-purple-400">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Cloud Security</span>
                      <span className="text-purple-400">80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Development Skills */}
            <Card className="bg-slate-800/50 border-teal-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5 text-teal-400" />
                  Development Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Full-Stack Development</span>
                      <span className="text-teal-400">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">API Development</span>
                      <span className="text-teal-400">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Database Design</span>
                      <span className="text-teal-400">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">DevOps & CI/CD</span>
                      <span className="text-teal-400">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engineering Skills */}
            <Card className="bg-slate-800/50 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-400" />
                  Engineering Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                    System Design
                  </Badge>
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                    Algorithms
                  </Badge>
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                    Data Structures
                  </Badge>
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                    Networking
                  </Badge>
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                    Linux/Unix
                  </Badge>
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                    Git/GitHub
                  </Badge>
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                    Agile/Scrum
                  </Badge>
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                    Testing
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Featured Projects</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore my portfolio of cybersecurity tools, applications, and engineering solutions
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* SecureVault Project */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-emerald-500 transition-all duration-300 group">
            <div className="relative overflow-hidden">
              <img
                src="/password-manager-app-interface-with-security-icons.jpg"
                alt="SecureVault Password Manager"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-emerald-500 text-white">Security</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="h-5 w-5 text-emerald-600" />
                SecureVault
              </CardTitle>
              <CardDescription className="text-gray-300">
                Advanced password manager with biometric authentication and AES-256 encryption
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">Node.js</Badge>
                <Badge variant="secondary">Encryption</Badge>
                <Badge variant="secondary">Biometrics</Badge>
              </div>
            </CardContent>
            <div className="flex gap-3 mt-6">
              <Button
                size="sm"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                onClick={() => window.open("/securevault", "_blank")}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Demo
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => window.open("https://github.com/MohamedEssam200/securevault", "_blank")}
              >
                <Github className="h-4 w-4 mr-1" />
                GitHub
              </Button>
            </div>
          </div>

          {/* Pentest Toolkit Project */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-emerald-500 transition-all duration-300 group">
            <div className="relative overflow-hidden">
              <img
                src="/cybersecurity-dashboard.jpg"
                alt="PenTest Toolkit"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-red-500 text-white">PenTest</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Search className="h-5 w-5 text-red-600" />
                PenTest Toolkit
              </CardTitle>
              <CardDescription className="text-gray-300">
                Automated vulnerability scanner with comprehensive reporting and remediation guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Python</Badge>
                <Badge variant="secondary">Nmap</Badge>
                <Badge variant="secondary">OWASP</Badge>
                <Badge variant="secondary">Automation</Badge>
              </div>
            </CardContent>
            <div className="flex gap-3 mt-6">
              <Button
                size="sm"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                onClick={() => window.open("/pentest", "_blank")}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Demo
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => window.open("https://github.com/MohamedEssam200/pentest-toolkit", "_blank")}
              >
                <Github className="h-4 w-4 mr-1" />
                GitHub
              </Button>
            </div>
          </div>

          {/* TaskFlow Project */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-emerald-500 transition-all duration-300 group">
            <div className="relative overflow-hidden">
              <img
                src="/modern-project-management-dashboard-with-kanban-bo.jpg"
                alt="TaskFlow Project Manager"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-blue-500 text-white">Productivity</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                TaskFlow
              </CardTitle>
              <CardDescription className="text-gray-300">
                Project management platform with Kanban boards, team collaboration, and real-time chat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Next.js</Badge>
                <Badge variant="secondary">MongoDB</Badge>
                <Badge variant="secondary">Socket.io</Badge>
                <Badge variant="secondary">Tailwind</Badge>
              </div>
            </CardContent>
            <div className="flex gap-3 mt-6">
              <Button
                size="sm"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                onClick={() => window.open("/taskflow", "_blank")}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Demo
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => window.open("https://github.com/MohamedEssam200/taskflow", "_blank")}
              >
                <Github className="h-4 w-4 mr-1" />
                GitHub
              </Button>
            </div>
          </div>

          {/* Network Analyzer Project */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-emerald-500 transition-all duration-300 group">
            <div className="relative overflow-hidden">
              <img
                src="/network-traffic-analysis-interface-with-graphs-and.jpg"
                alt="Network Analyzer"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-purple-500 text-white">Networking</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Router className="h-5 w-5 text-purple-600" />
                Network Analyzer
              </CardTitle>
              <CardDescription className="text-gray-300">
                Real-time network traffic monitoring and analysis tool with threat detection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Python</Badge>
                <Badge variant="secondary">Wireshark</Badge>
                <Badge variant="secondary">Scapy</Badge>
                <Badge variant="secondary">ML</Badge>
              </div>
            </CardContent>
            <div className="flex gap-3 mt-6">
              <Button
                size="sm"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                onClick={() => window.open("/network-analyzer", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View Demo
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => window.open("https://github.com/MohamedEssam200/network-analyzer", "_blank")}
              >
                <Github className="h-4 w-4 mr-1" />
                GitHub
              </Button>
            </div>
          </div>

          {/* CryptoChat Project */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-emerald-500 transition-all duration-300 group">
            <div className="relative overflow-hidden">
              <img
                src="/secure-messaging-app-interface-with-encryption-ind.jpg"
                alt="CryptoChat"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-teal-500 text-white">Encryption</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-teal-600" />
                CryptoChat
              </CardTitle>
              <CardDescription className="text-gray-300">
                End-to-end encrypted messaging app with perfect forward secrecy and self-destructing messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">React Native</Badge>
                <Badge variant="secondary">Signal Protocol</Badge>
                <Badge variant="secondary">WebRTC</Badge>
                <Badge variant="secondary">E2EE</Badge>
              </div>
            </CardContent>
            <div className="flex gap-3 mt-6">
              <Button
                size="sm"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                onClick={() => window.open("/cryptochat", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View Demo
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => window.open("https://github.com/MohamedEssam200/cryptochat", "_blank")}
              >
                <Github className="h-4 w-4 mr-1" />
                GitHub
              </Button>
            </div>
          </div>

          {/* IoT Security Audit Project */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-emerald-500 transition-all duration-300 group">
            <div className="relative overflow-hidden">
              <img
                src="/iot-security-testing-setup-with-connected-devices.jpg"
                alt="IoT Security Audit"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-orange-500 text-white">IoT</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wifi className="h-5 w-5 text-orange-600" />
                IoT Security Audit
              </CardTitle>
              <CardDescription className="text-gray-300">
                Comprehensive IoT device security testing framework with automated vulnerability detection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Python</Badge>
                <Badge variant="secondary">Firmware</Badge>
                <Badge variant="secondary">MQTT</Badge>
                <Badge variant="secondary">Hardware</Badge>
              </div>
            </CardContent>
            <div className="flex gap-3 mt-6">
              <Button
                size="sm"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                onClick={() => window.open("/iot-security", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View Demo
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => window.open("https://github.com/MohamedEssam200/iot-security-audit", "_blank")}
              >
                <Github className="h-4 w-4 mr-1" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Certifications</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professional certifications and achievements in cybersecurity and technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-900/50 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-3 rounded-lg">
                      <Shield className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">Certified Ethical Hacker (CEH)</CardTitle>
                      <p className="text-sm text-gray-400">EC-Council</p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-3">
                  Advanced ethical hacking and penetration testing certification
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Award className="h-4 w-4" />
                  <span>Issued: March 2024</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-3 rounded-lg">
                      <Lock className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">CompTIA Security+</CardTitle>
                      <p className="text-sm text-gray-400">CompTIA</p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-3">
                  Foundation-level cybersecurity skills and knowledge certification
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Award className="h-4 w-4" />
                  <span>Issued: January 2024</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500/20 p-3 rounded-lg">
                      <Server className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">AWS Cloud Practitioner</CardTitle>
                      <p className="text-sm text-gray-400">Amazon Web Services</p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-orange-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-3">
                  Cloud computing fundamentals and AWS services certification
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Award className="h-4 w-4" />
                  <span>Issued: December 2023</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/20 p-3 rounded-lg">
                      <Code className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">OSCP</CardTitle>
                      <p className="text-sm text-gray-400">Offensive Security</p>
                    </div>
                  </div>
                  <Clock className="h-5 w-5 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-3">Advanced penetration testing certification (In Progress)</p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Expected: June 2024</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-teal-500/20 hover:border-teal-500/40 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-500/20 p-3 rounded-lg">
                      <Globe className="h-6 w-6 text-teal-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">CISSP</CardTitle>
                      <p className="text-sm text-gray-400">(ISC)²</p>
                    </div>
                  </div>
                  <Clock className="h-5 w-5 text-teal-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-3">Information security management certification (Planned)</p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Expected: 2025</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-red-500/20 hover:border-red-500/40 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500/20 p-3 rounded-lg">
                      <Search className="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">GCIH</CardTitle>
                      <p className="text-sm text-gray-400">GIAC</p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-red-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-3">Incident handling and computer security essentials</p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Award className="h-4 w-4" />
                  <span>Issued: February 2024</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section - moved to bottom of portfolio */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Services</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professional cybersecurity and development services tailored to your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-900/50 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/20 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-emerald-400" />
                  </div>
                  <CardTitle className="text-white">Penetration Testing</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-gray-300">
                  Comprehensive security assessments to identify vulnerabilities in your systems
                </CardDescription>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Network Security Assessment</li>
                  <li>• Web Application Testing</li>
                  <li>• Vulnerability Scanning</li>
                  <li>• Security Report & Remediation</li>
                </ul>
                <div className="pt-4">
                  <p className="text-emerald-400 font-semibold">Starting at $500</p>
                  <Button
                    className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() =>
                      (window.location.href =
                        "mailto:mohamedessam15052002@gmail.com?subject=Penetration Testing Services Quote&body=Hi Mohamed, I'm interested in your penetration testing services. Please provide a quote for my project.")
                    }
                  >
                    Get Quote
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-teal-500/20 hover:border-teal-500/40 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-teal-500/20 p-3 rounded-lg">
                    <Code className="h-6 w-6 text-teal-400" />
                  </div>
                  <CardTitle className="text-white">Full-Stack Development</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-gray-300">
                  Custom web and mobile applications built with modern technologies
                </CardDescription>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• React/Next.js Applications</li>
                  <li>• Mobile App Development</li>
                  <li>• API Development & Integration</li>
                  <li>• Database Design & Management</li>
                </ul>
                <div className="pt-4">
                  <p className="text-teal-400 font-semibold">Starting at $1,000</p>
                  <Button
                    className="w-full mt-3 bg-teal-600 hover:bg-teal-700"
                    onClick={() =>
                      (window.location.href =
                        "mailto:mohamedessam15052002@gmail.com?subject=Web Application Development Quote&body=Hi Mohamed, I'm interested in your web development services. Please provide a quote for my project.")
                    }
                  >
                    Get Quote
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-500/20 p-3 rounded-lg">
                    <Lock className="h-6 w-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-white">Security Consulting</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-gray-300">
                  Strategic security guidance and implementation for your organization
                </CardDescription>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Security Policy Development</li>
                  <li>• Risk Assessment & Management</li>
                  <li>• Compliance Auditing</li>
                  <li>• Security Training & Awareness</li>
                </ul>
                <div className="pt-4">
                  <p className="text-cyan-400 font-semibold">Starting at $300</p>
                  <Button
                    className="w-full mt-3 bg-cyan-600 hover:bg-cyan-700"
                    onClick={() =>
                      (window.location.href =
                        "mailto:mohamedessam15052002@gmail.com?subject=Security Consulting Quote&body=Hi Mohamed, I'm interested in your security consulting services. Please provide a quote for my project.")
                    }
                  >
                    Get Quote
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <Search className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-white">Vulnerability Assessment</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-gray-300">
                  Automated and manual testing to discover security weaknesses
                </CardDescription>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Automated Vulnerability Scans</li>
                  <li>• Manual Security Testing</li>
                  <li>• Code Review & Analysis</li>
                  <li>• Remediation Guidance</li>
                </ul>
                <div className="pt-4">
                  <p className="text-purple-400 font-semibold">Starting at $400</p>
                  <Button
                    className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
                    onClick={() =>
                      (window.location.href =
                        "mailto:mohamedessam15052002@gmail.com?subject=Vulnerability Assessment Quote&body=Hi Mohamed, I'm interested in your vulnerability assessment services. Please provide a quote for my project.")
                    }
                  >
                    Get Quote
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-500/20 p-3 rounded-lg">
                    <Smartphone className="h-6 w-6 text-orange-400" />
                  </div>
                  <CardTitle className="text-white">Mobile App Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-gray-300">
                  Comprehensive security testing for iOS and Android applications
                </CardDescription>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Static & Dynamic Analysis</li>
                  <li>• Runtime Security Testing</li>
                  <li>• API Security Assessment</li>
                  <li>• Secure Coding Guidelines</li>
                </ul>
                <div className="pt-4">
                  <p className="text-orange-400 font-semibold">Starting at $600</p>
                  <Button
                    className="w-full mt-3 bg-orange-600 hover:bg-orange-700"
                    onClick={() =>
                      (window.location.href =
                        "mailto:mohamedessam15052002@gmail.com?subject=Mobile App Security Quote&body=Hi Mohamed, I'm interested in your mobile app security services. Please provide a quote for my project.")
                    }
                  >
                    Get Quote
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <Server className="h-6 w-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-white">Infrastructure Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-gray-300">
                  Secure your cloud and on-premise infrastructure against threats
                </CardDescription>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Cloud Security Assessment</li>
                  <li>• Network Architecture Review</li>
                  <li>• Server Hardening</li>
                  <li>• Monitoring & Incident Response</li>
                </ul>
                <div className="pt-4">
                  <p className="text-blue-400 font-semibold">Starting at $800</p>
                  <Button
                    className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                    onClick={() =>
                      (window.location.href =
                        "mailto:mohamedessam15052002@gmail.com?subject=Infrastructure Security Quote&body=Hi Mohamed, I'm interested in your infrastructure security services. Please provide a quote for my project.")
                    }
                  >
                    Get Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">Let's Work Together</h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Ready to secure your digital assets or build your next application? Let's discuss how I can help protect
              and enhance your technology infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
                onClick={() => (window.location.href = "mailto:mohamedessam15052002@gmail.com")}
              >
                Get In Touch
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white px-8 py-3 bg-transparent"
              >
                Download Resume
              </Button>
            </div>
            <div className="flex justify-center gap-6 mt-8">
              <a
                href="https://github.com/MohamedEssam200"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/mohammed-essam-ali"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="mailto:mohamedessam15052002@gmail.com"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
