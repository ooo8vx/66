import React, { useState, useEffect } from 'react';
import { Github, MessageCircle, Instagram, Crown, User, Mail, ExternalLink, Code, Database, Cpu, MapPin, Calendar, Send, Phone, Globe } from 'lucide-react';
import { useDiscordAvatar } from './hooks/useDiscordAvatar';
import { useUser, useProjects, useContacts } from './hooks/useDatabase';
import { UserService } from './services/userService';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState('welcome');
  const [showWelcome, setShowWelcome] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Discord User ID - Updated with your actual Discord User ID
  const DISCORD_USER_ID = "394912002843344898";
  const { avatarData, loading: avatarLoading, error: avatarError } = useDiscordAvatar(DISCORD_USER_ID);
  
  // Database hooks
  const { user, loading: userLoading } = useUser(DISCORD_USER_ID);
  const { projects, loading: projectsLoading } = useProjects(user?._id?.toString(), true);
  const { createContact } = useContacts();

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

  // Initialize user in database when avatar data is available
  useEffect(() => {
    const initializeUser = async () => {
      if (avatarData && !userLoading) {
        try {
          await UserService.createOrUpdateUser({
            discordId: DISCORD_USER_ID,
            username: avatarData.username,
            discriminator: avatarData.discriminator,
            avatarUrl: avatarData.avatarUrl
          });
        } catch (error) {
          console.error('Failed to initialize user:', error);
        }
      }
    };

    initializeUser();
  }, [avatarData, userLoading]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createContact(contactForm);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      alert('تم إرسال رسالتك بنجاح! سأقوم بالرد عليك قريباً.');
    } catch (error) {
      alert('حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { 
      name: 'Github', 
      icon: Github, 
      url: user?.socialLinks?.github || 'https://github.com/lordx679', 
      color: 'hover:text-[#a9afb2]',
      description: 'تحقق من مستودعات الكود الخاصة بي'
    },
    { 
      name: 'Discord', 
      icon: MessageCircle, 
      url: user?.socialLinks?.discord || '#', 
      color: 'hover:text-[#a9afb2]',
      description: 'تواصل معي على الديسكورد'
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      url: user?.socialLinks?.instagram || '#', 
      color: 'hover:text-[#a9afb2]',
      description: 'تابع رحلتي الإبداعية'
    },
  ];

  const skills = [
    { 
      category: 'Frontend Development', 
      items: user?.skills?.filter(skill => 
        ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'Vue.js', 'Angular'].includes(skill)
      ) || ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'], 
      icon: Code, 
      color: 'from-[#3f4b48] to-[#7d8181]' 
    },
    { 
      category: 'Backend Development', 
      items: user?.skills?.filter(skill => 
        ['Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'Express.js', 'FastAPI', 'Django'].includes(skill)
      ) || ['Node.js', 'Python', 'MongoDB', 'Express.js'], 
      icon: Database, 
      color: 'from-[#7d8181] to-[#a9afb2]' 
    },
    { 
      category: 'Tools & Technologies', 
      items: user?.skills?.filter(skill => 
        ['Git', 'Docker', 'AWS', 'Figma', 'VS Code', 'Linux', 'Nginx'].includes(skill)
      ) || ['Git', 'Docker', 'AWS', 'Figma', 'VS Code'], 
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
              أهلاً وسهلاً
            </h1>
            <div className="flex items-center justify-center space-x-4 text-4xl lg:text-6xl font-bold">
              <span className="text-[#7d8181] animate-pulse delay-300">في</span>
              <div className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a9afb2] via-[#d0d4d7] to-[#a9afb2] animate-pulse delay-500">
                  عالم
                </span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#7d8181] rounded-full animate-ping"></div>
              </div>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7d8181] via-[#a9afb2] to-[#d0d4d7] animate-pulse delay-700 drop-shadow-xl">
              LORD
            </h2>
          </div>

          {/* Loading Animation */}
          <div className="mt-12">
            <div className="w-64 h-1 bg-[#3f4b48] rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#7d8181] to-[#a9afb2] rounded-full animate-pulse transform origin-left scale-x-0 animate-[scaleX_4s_ease-in-out_forwards]"></div>
            </div>
            <p className="text-[#7d8181] text-sm mt-4 animate-pulse delay-1000">جاري الدخول إلى العالم الأسطوري...</p>
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
              {['about', 'projects', 'connect'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`text-sm font-bold transition-all duration-300 capitalize relative ${
                    activeSection === section 
                      ? 'text-[#a9afb2] border-b-2 border-[#7d8181]' 
                      : 'text-[#7d8181] hover:text-[#a9afb2]'
                  }`}
                >
                  {section === 'about' ? 'نبذة' : section === 'projects' ? 'مشاريع' : 'تواصل'}
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
                    أنا <span className="text-[#a9afb2]">LORD</span>
                  </h1>
                  <p className="text-xl lg:text-2xl text-[#7d8181] mb-6">
                    مطور Full-Stack ومبدع رقمي
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
                        نبذة عني
                      </h3>
                      <div className="space-y-3 text-[#d0d4d7]">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-[#7d8181] rounded-full mr-3"></div>
                          <span><strong>الاسم:</strong> {user?.username || 'LORDX679'}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-[#7d8181] mr-3" />
                          <span><strong>العمر:</strong> 18 سنة</span>
                        </div>
                        <div className="flex items-center">
                          <Code className="h-4 w-4 text-[#7d8181] mr-3" />
                          <span><strong>التخصص:</strong> مطور Full-Stack</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-[#7d8181] mr-3" />
                          <span><strong>الموقع:</strong> المغرب ← إيطاليا</span>
                        </div>
                        {user?.createdAt && (
                          <div className="flex items-center">
                            <Database className="h-4 w-4 text-[#7d8181] mr-3" />
                            <span><strong>انضم:</strong> {new Date(user.createdAt).toLocaleDateString('ar-SA')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#a9afb2] mb-4">قصتي</h3>
                      <p className="text-[#d0d4d7] leading-relaxed text-sm">
                        {user?.bio || `أنا LORD — مطور مغربي عمري 18 سنة أعيش في إيطاليا، أبني تجارب رقمية بدقة وعمق وهدف. لا أكتب الكود فقط — أصمم الحضور. كل مشروع أبنيه مؤسس على رؤية، مدفوع بهوس هادئ بالتفاصيل والحركة والإحساس. عملي ليس ضوضاء أو بريق — إنه وضوح وتدفق وسيطرة. أستلهم من منطق الكود، وأناقة التصميم البسيط، والوزن الخفي لقصص الأنمي — لا أهدف للإعجاب، أهدف لترك أثر. أثر حاد. أثر حقيقي. التكنولوجيا سلاحي. الويب ساحة معركتي.`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  <button 
                    onClick={() => setActiveSection('projects')}
                    className="px-8 py-3 bg-gradient-to-r from-[#7d8181] to-[#a9afb2] text-[#151719] font-bold rounded-lg hover:from-[#a9afb2] hover:to-[#d0d4d7] transition-all duration-300 hover:scale-105 shadow-2xl"
                  >
                    عرض أعمالي
                  </button>
                  <button 
                    onClick={() => setActiveSection('connect')}
                    className="px-8 py-3 border-2 border-[#7d8181] text-[#a9afb2] font-bold rounded-lg hover:bg-[#7d8181] hover:text-[#151719] transition-all duration-300 shadow-xl"
                  >
                    تواصل معي
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

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <div className="min-h-screen flex items-center justify-center px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#a9afb2] to-[#d0d4d7] mb-6 drop-shadow-xl">مشاريعي المميزة</h2>
                <p className="text-xl text-[#7d8181] max-w-3xl mx-auto">
                  مجموعة من أفضل أعمالي في تطوير الويب والتطبيقات
                </p>
              </div>

              {projectsLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-gradient-to-br from-[#3f4b48]/50 to-[#151719]/50 border-2 border-[#3f4b48] rounded-lg p-6 animate-pulse">
                      <div className="w-full h-48 bg-[#7d8181]/20 rounded-lg mb-4"></div>
                      <div className="h-6 bg-[#7d8181]/20 rounded mb-2"></div>
                      <div className="h-4 bg-[#7d8181]/20 rounded mb-4"></div>
                      <div className="flex space-x-2">
                        <div className="h-6 w-16 bg-[#7d8181]/20 rounded"></div>
                        <div className="h-6 w-20 bg-[#7d8181]/20 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : projects.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project, index) => (
                    <div key={project._id} className="bg-gradient-to-br from-[#3f4b48]/50 to-[#151719]/50 border-2 border-[#3f4b48] rounded-lg overflow-hidden hover:border-[#7d8181] transition-all duration-300 shadow-2xl group hover:scale-105">
                      {project.imageUrl && (
                        <div className="w-full h-48 overflow-hidden">
                          <img 
                            src={project.imageUrl} 
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-[#a9afb2] mb-2">{project.title}</h3>
                        <p className="text-[#d0d4d7] text-sm mb-4 line-clamp-3">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.slice(0, 3).map((tech, idx) => (
                            <span key={idx} className="px-2 py-1 bg-[#7d8181]/20 text-[#a9afb2] text-xs rounded-full">
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="px-2 py-1 bg-[#7d8181]/20 text-[#a9afb2] text-xs rounded-full">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-[#7d8181]">
                            <span className="flex items-center">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              {project.views || 0}
                            </span>
                            <span className="flex items-center">
                              ❤️ {project.likes || 0}
                            </span>
                          </div>
                          
                          <div className="flex space-x-2">
                            {project.githubUrl && (
                              <a 
                                href={project.githubUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-[#7d8181] text-[#151719] rounded-lg hover:bg-[#a9afb2] transition-colors"
                              >
                                <Github className="h-4 w-4" />
                              </a>
                            )}
                            {project.liveUrl && (
                              <a 
                                href={project.liveUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-[#a9afb2] text-[#151719] rounded-lg hover:bg-[#d0d4d7] transition-colors"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Code className="h-24 w-24 text-[#7d8181] mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-[#a9afb2] mb-4">قريباً...</h3>
                  <p className="text-[#d0d4d7] max-w-md mx-auto">
                    أعمل حالياً على مشاريع مذهلة. ترقبوا إضافة أعمالي قريباً!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Connect Section */}
        {activeSection === 'connect' && (
          <div className="min-h-screen flex items-center justify-center px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#a9afb2] to-[#d0d4d7] mb-6 drop-shadow-xl">تواصل معي</h2>
                <p className="text-xl text-[#7d8181] max-w-3xl mx-auto">
                  دعنا نتواصل ونبني شيئاً مذهلاً معاً. تجدني على هذه المنصات ولنبدأ محادثة.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 mb-12">
                {/* Social Links */}
                <div>
                  <h3 className="text-2xl font-bold text-[#a9afb2] mb-6">وسائل التواصل</h3>
                  <div className="space-y-4">
                    {socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center p-4 bg-gradient-to-br from-[#3f4b48]/50 to-[#151719]/50 border-2 border-[#3f4b48] rounded-lg hover:border-[#7d8181] transition-all duration-300 shadow-xl hover:scale-105"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-[#7d8181] to-[#a9afb2] rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <link.icon className="h-6 w-6 text-[#151719]" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-[#a9afb2]">{link.name}</h4>
                          <p className="text-[#d0d4d7] text-sm">{link.description}</p>
                        </div>
                        <ExternalLink className="h-5 w-5 text-[#7d8181] group-hover:text-[#a9afb2] transition-colors duration-300 ml-auto" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <h3 className="text-2xl font-bold text-[#a9afb2] mb-6">أرسل رسالة</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="اسمك"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full p-4 bg-[#3f4b48]/50 border-2 border-[#3f4b48] rounded-lg text-white placeholder-[#7d8181] focus:border-[#a9afb2] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="بريدك الإلكتروني"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="w-full p-4 bg-[#3f4b48]/50 border-2 border-[#3f4b48] rounded-lg text-white placeholder-[#7d8181] focus:border-[#a9afb2] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="موضوع الرسالة"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        required
                        className="w-full p-4 bg-[#3f4b48]/50 border-2 border-[#3f4b48] rounded-lg text-white placeholder-[#7d8181] focus:border-[#a9afb2] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="رسالتك"
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        required
                        className="w-full p-4 bg-[#3f4b48]/50 border-2 border-[#3f4b48] rounded-lg text-white placeholder-[#7d8181] focus:border-[#a9afb2] focus:outline-none transition-colors resize-none"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-8 py-4 bg-gradient-to-r from-[#7d8181] to-[#a9afb2] text-[#151719] font-bold rounded-lg hover:from-[#a9afb2] hover:to-[#d0d4d7] transition-all duration-300 hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-[#151719] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          إرسال الرسالة
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#3f4b48]/50 to-[#151719]/50 border-2 border-[#3f4b48] rounded-lg p-8 text-center shadow-2xl">
                <Crown className="h-12 w-12 text-[#7d8181] mx-auto mb-6" />
                <h3 className="text-2xl font-black text-[#a9afb2] mb-4">مستعد للتعاون؟</h3>
                <p className="text-[#d0d4d7] mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                  أنا دائماً منفتح لمناقشة المشاريع الجديدة والأفكار الإبداعية أو الفرص لأكون جزءاً من رؤيتك. 
                  سواء كنت تحتاج موقع ويب أو تطبيق ويب أو تريد فقط الدردشة حول التكنولوجيا، لا تتردد في التواصل!
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-[#7d8181]" />
                    <span className="text-[#a9afb2] font-bold">متاح للمشاريع</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[#7d8181]">وقت الرد:</span>
                    <span className="text-[#a9afb2] font-bold">{'< 24 ساعة'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;