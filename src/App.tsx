import React, { useState, useEffect } from 'react';
import { Github, MessageCircle, Instagram, Crown, User, Mail, ExternalLink, Code, Database, Cpu, MapPin, Calendar } from 'lucide-react';
import { useDiscordAvatar } from './hooks/useDiscordAvatar';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState('welcome');
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Discord User ID - Updated with your actual Discord User ID
  const DISCORD_USER_ID = "394912002843344898";
  const { avatarData, loading: avatarLoading, error: avatarError } = useDiscordAvatar(DISCORD_USER_ID);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Auto transition from welcome screen after 4 seconds
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
      setActiveSection('about');
    }, 4000);

    return () => {
      clearInterval(timer);
      clearTimeout(welcomeTimer);
    };
  }, []);

  const socialLinks = [
    { 
      name: 'Github', 
      icon: Github, 
      url: 'https://github.com/lordx679', 
      color: 'hover:text-[#a9afb2]',
      description: 'Check out my code repositories'
    },
    { 
      name: 'Discord', 
      icon: MessageCircle, 
      url: '#', 
      color: 'hover:text-[#a9afb2]',
      description: 'Connect with me on Discord'
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      url: '#', 
      color: 'hover:text-[#a9afb2]',
      description: 'Follow my creative journey'
    },
  ];

  const skills = [
    { 
      category: 'Frontend Development', 
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'], 
      icon: Code, 
      color: 'from-[#3f4b48] to-[#7d8181]' 
    },
    { 
      category: 'Backend Development', 
      items: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Express.js'], 
      icon: Database, 
      color: 'from-[#7d8181] to-[#a9afb2]' 
    },
    { 
      category: 'Tools & Technologies', 
      items: ['Git', 'Docker', 'AWS', 'Figma', 'VS Code'], 
      icon: Cpu, 
      color: 'from-[#a9afb2] to-[#d0d4d7]' 
    },
  ];

  // Welcome Screen
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-[#151719] flex items-center justify-center relative overflow-hidden">
        {/* Epic Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#151719] via-[#3f4b48] to-[#151719]"></div>
          
          {/* Floating Particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#a9afb2] rounded-full animate-ping opacity-70"></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-[#7d8181] rounded-full animate-pulse opacity-60"></div>
          <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-[#d0d4d7] rounded-full animate-bounce opacity-50"></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-[#a9afb2] rounded-full animate-ping opacity-80"></div>
          
          {/* Epic Glow Effects */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7d8181]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#a9afb2]/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-[#d0d4d7]/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        {/* Welcome Content */}
        <div className="relative z-10 text-center">
          {/* Legendary Crown Icon */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 mx-auto mb-6 relative animate-bounce">
              <Crown className="w-full h-full text-[#a9afb2] drop-shadow-2xl animate-pulse" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#7d8181] to-[#a9afb2] rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-[#a9afb2] to-[#d0d4d7] rounded-full animate-pulse delay-500"></div>
            </div>
          </div>

          {/* Epic Welcome Text */}
          <div className="space-y-6">
            <h1 className="text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#a9afb2] via-[#d0d4d7] to-[#a9afb2] animate-pulse drop-shadow-2xl">
              WELCOME
            </h1>
            <div className="flex items-center justify-center space-x-4 text-4xl lg:text-6xl font-bold">
              <span className="text-[#7d8181] animate-pulse delay-300">TO</span>
              <div className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a9afb2] via-[#d0d4d7] to-[#a9afb2] animate-pulse delay-500">
                  LORD
                </span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#7d8181] rounded-full animate-ping"></div>
              </div>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7d8181] via-[#a9afb2] to-[#d0d4d7] animate-pulse delay-700 drop-shadow-xl">
              WORLD
            </h2>
          </div>

          {/* Loading Animation */}
          <div className="mt-12">
            <div className="w-64 h-1 bg-[#3f4b48] rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#7d8181] to-[#a9afb2] rounded-full animate-pulse transform origin-left scale-x-0 animate-[scaleX_4s_ease-in-out_forwards]"></div>
            </div>
            <p className="text-[#7d8181] text-sm mt-4 animate-pulse delay-1000">Entering the legendary realm...</p>
          </div>
        </div>

        {/* Epic Border Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7d8181] to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#a9afb2] to-transparent animate-pulse delay-500"></div>
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[#d0d4d7] to-transparent animate-pulse delay-1000"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[#7d8181] to-transparent animate-pulse delay-1500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151719] text-white relative overflow-hidden">
      {/* Epic Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#151719] via-[#3f4b48] to-[#151719]"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#7d8181]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-[#a9afb2]/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/4 left-1/2 w-32 h-32 bg-[#d0d4d7]/20 rounded-full blur-xl animate-bounce"></div>
      </div>

      {/* Legendary Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#151719]/90 backdrop-blur-md border-b border-[#3f4b48]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#7d8181] to-[#a9afb2] rounded-lg flex items-center justify-center relative">
                <Crown className="h-6 w-6 text-[#151719]" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#a9afb2] rounded-full animate-ping"></div>
              </div>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#a9afb2] to-[#d0d4d7]">LORDX679</span>
            </div>
            <div className="flex items-center space-x-8">
              {['about', 'connect'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`text-sm font-bold transition-all duration-300 capitalize relative ${
                    activeSection === section 
                      ? 'text-[#a9afb2] border-b-2 border-[#7d8181]' 
                      : 'text-[#7d8181] hover:text-[#a9afb2]'
                  }`}
                >
                  {section}
                  {activeSection === section && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#7d8181] rounded-full animate-ping"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 relative z-10">
        {/* About Section */}
        {activeSection === 'about' && (
          <div className="min-h-screen flex items-center justify-center px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="mb-8">
                  <div className="w-32 h-32 mx-auto mb-8 relative">
                    <div className="w-full h-full bg-gradient-to-r from-[#7d8181] via-[#a9afb2] to-[#d0d4d7] rounded-full p-1">
                      <div className="w-full h-full bg-[#151719] rounded-full flex items-center justify-center overflow-hidden relative">
                        {/* صورة الأفاتار */}
                        {avatarData?.avatarUrl ? (
                          <img 
                            src={avatarData.avatarUrl} 
                            alt="Discord Avatar"
                            className="w-full h-full object-cover rounded-full transition-opacity duration-300"
                            onError={(e) => {
                              // في حالة فشل تحميل الصورة، أخفها واعرض التاج
                              e.currentTarget.style.display = 'none';
                              const crownElement = e.currentTarget.parentElement?.querySelector('.crown-fallback');
                              if (crownElement) {
                                crownElement.classList.remove('hidden');
                              }
                            }}
                          />
                        ) : null}
                        
                        {/* التاج الاحتياطي */}
                        <Crown className={`crown-fallback h-16 w-16 text-[#a9afb2] ${avatarData?.avatarUrl ? 'hidden' : ''}`} />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#7d8181] to-[#a9afb2] rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-3 h-3 bg-[#151719] rounded-full"></div>
                    </div>
                  </div>
                  
                  <h1 className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#a9afb2] via-[#d0d4d7] to-[#a9afb2] mb-4 drop-shadow-2xl">
                    I'm <span className="text-[#a9afb2]">LORD</span>
                  </h1>
                  <p className="text-xl lg:text-2xl text-[#7d8181] mb-6">
                    Full-Stack Developer & Digital Creator
                  </p>
                  
                  {/* معلومات الديسكورد */}
                  {avatarData && (
                    <div className="text-sm text-[#a9afb2] mb-4 flex items-center justify-center space-x-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>Discord: {avatarData.username}</span>
                    </div>
                  )}
                </div>

                {/* Personal Info */}
                <div className="bg-gradient-to-br from-[#3f4b48]/50 to-[#151719]/50 border-2 border-[#3f4b48] rounded-lg p-8 mb-8 shadow-2xl">
                  <div className="grid md:grid-cols-2 gap-8 text-left">
                    <div>
                      <h3 className="text-2xl font-bold text-[#a9afb2] mb-4 flex items-center">
                        <User className="h-6 w-6 mr-3" />
                        About Me
                      </h3>
                      <div className="space-y-3 text-[#d0d4d7]">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-[#7d8181] rounded-full mr-3"></div>
                          <span><strong>Name:</strong> LORDX679</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-[#7d8181] mr-3" />
                          <span><strong>Age:</strong> 18 years old</span>
                        </div>
                        <div className="flex items-center">
                          <Code className="h-4 w-4 text-[#7d8181] mr-3" />
                          <span><strong>Role:</strong> Full-Stack Developer</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-[#7d8181] mr-3" />
                          <span><strong>Location:</strong> Morocco → Italy</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#a9afb2] mb-4">My Story</h3>
                      <p className="text-[#d0d4d7] leading-relaxed text-sm">
                        I'm LORD — an 18-year-old Moroccan developer living in Italy, building digital experiences with precision, depth, and purpose. I don't just write code — I design presence. Every project I build is grounded in vision, driven by a quiet obsession with detail, motion, and feel. My work isn't noise or flash — it's clarity, flow, and control. I draw inspiration from the logic of code, the elegance of minimal design, and the hidden weight of anime stories — I don't aim to impress, I aim to leave a mark. A sharp one. A real one. Technology is my weapon. The web is my battlefield. Whether it's a fluid UI, an animated portfolio, or a system built from the ground up — I move in silence, but my work speaks loud. You won't find everything about me in the code — but read between the lines, and you'll know exactly who I am.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  <button className="px-8 py-3 bg-gradient-to-r from-[#7d8181] to-[#a9afb2] text-[#151719] font-bold rounded-lg hover:from-[#a9afb2] hover:to-[#d0d4d7] transition-all duration-300 hover:scale-105 shadow-2xl">
                    View My Work
                  </button>
                  <button className="px-8 py-3 border-2 border-[#7d8181] text-[#a9afb2] font-bold rounded-lg hover:bg-[#7d8181] hover:text-[#151719] transition-all duration-300 shadow-xl">
                    Get In Touch
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-gradient-to-br from-[#3f4b48]/50 to-[#151719]/50 border-2 border-[#3f4b48] rounded-lg p-6 hover:border-[#7d8181] transition-all duration-300 shadow-2xl group">
                    <div className="flex items-center mb-4">
                      <skill.icon className="h-8 w-8 text-[#7d8181] mr-3 group-hover:text-[#a9afb2] transition-colors" />
                      <h4 className="text-lg font-bold text-[#a9afb2]">{skill.category}</h4>
                    </div>
                    <div className="space-y-2">
                      {skill.items.map((item, idx) => (
                        <div key={idx} className="text-[#d0d4d7] text-sm flex items-center">
                          <div className="w-2 h-2 bg-[#7d8181] rounded-full mr-3"></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Connect Section - Social Media */}
        {activeSection === 'connect' && (
          <div className="min-h-screen flex items-center justify-center px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#a9afb2] to-[#d0d4d7] mb-6 drop-shadow-xl">Connect With Me</h2>
                <p className="text-xl text-[#7d8181] max-w-3xl mx-auto">
                  Let's connect and build something amazing together. 
                  Find me on these platforms and let's start a conversation.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-gradient-to-br from-[#3f4b48]/50 to-[#151719]/50 border-2 border-[#3f4b48] rounded-lg p-8 hover:border-[#7d8181] transition-all duration-300 shadow-2xl hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#7d8181] to-[#a9afb2] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <link.icon className="h-8 w-8 text-[#151719]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#a9afb2] mb-3">{link.name}</h3>
                      <p className="text-[#d0d4d7] text-sm">{link.description}</p>
                      <div className="mt-4">
                        <ExternalLink className="h-5 w-5 text-[#7d8181] group-hover:text-[#a9afb2] transition-colors duration-300 mx-auto" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="bg-gradient-to-br from-[#3f4b48]/50 to-[#151719]/50 border-2 border-[#3f4b48] rounded-lg p-8 text-center shadow-2xl">
                <Crown className="h-12 w-12 text-[#7d8181] mx-auto mb-6" />
                <h3 className="text-2xl font-black text-[#a9afb2] mb-4">Ready to Collaborate?</h3>
                <p className="text-[#d0d4d7] mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                  I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. 
                  Whether you need a website, web application, or just want to chat about technology, feel free to reach out!
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-[#7d8181]" />
                    <span className="text-[#a9afb2] font-bold">Available for Projects</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[#7d8181]">Response Time:</span>
                    <span className="text-[#a9afb2] font-bold">{'< 24 hours'}</span>
                  </div>
                </div>
                <button className="px-8 py-3 bg-gradient-to-r from-[#7d8181] to-[#a9afb2] text-[#151719] font-bold rounded-lg hover:from-[#a9afb2] hover:to-[#d0d4d7] transition-all duration-300 hover:scale-105 shadow-2xl">
                  Let's Work Together
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;