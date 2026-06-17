import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import {
  Sparkles,
  ShoppingCart,
  Volume2,
  VolumeX,
  ArrowLeft,
  ArrowRight,
  Flame,
  Heart,
  Share2,
  Trash2,
  Award,
  Zap,
  Star,
  Layers,
  ChevronRight,
  TrendingUp,
  Smile,
  X
} from 'lucide-react';

// Custom inline SVG Instagram component to prevent dependency version conflicts
const Instagram = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// Import Assets
import logoFoxLotus from './assets/fox_lotus_logo.jpg';
import logoSoulFuel from './assets/soul_fuel_logo.jpg';
import packCheese from './assets/makhana_cheese.jpg';
import packChilli from './assets/makhana_honey_chilli.jpg';
import packSalt from './assets/makhana_pink_salt.jpg';
import imgHarvest from './assets/wetlands_harvest.png';
import imgPopping from './assets/seed_popping.png';
import imgDrip from './assets/flavor_drip.png';
import imgInstaPost1 from './assets/insta_post_1.png';
import imgInstaPost2 from './assets/insta_post_2.png';
import imgInstaPost3 from './assets/insta_post_3.png';
import imgInstaPost4 from './assets/insta_post_4.png';
import imgInstaPost5 from './assets/insta_post_5.png';
import videoInstaPost4 from './assets/insta_post_4_video.mp4';

// Web Audio API Sound Synthesizer (Zero dependencies!)
const playSound = (type, isMuted) => {
  if (isMuted) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'hover') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.setValueAtTime(900, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'crunch') {
      // Crackle + Pop synthesis for crisp crunching!
      const duration = 0.2;
      const sampleRate = ctx.sampleRate;
      const bufferSize = sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      // Generate sharp pop impulses
      for (let i = 0; i < bufferSize; i++) {
        // High frequency white noise crackles
        const noise = Math.random() * 2 - 1;
        const envelope = Math.pow(1 - i / bufferSize, 3);
        const impulse = (i % 250 < 10) ? (Math.random() * 0.4 - 0.2) : 0;
        data[i] = (noise * 0.15 + impulse) * envelope;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1600;
      filter.Q.value = 2.5;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start();
    } else if (type === 'laser') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    // Ignore context blocked errors
  }
};

const triggerConfetti = (x, y) => {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();

  const colors = ['#adff2f', '#00e5ff', '#ff007f', '#ffff00', '#ff8c00', '#9400d3', '#00ff00'];
  const particles = [];

  for (let i = 0; i < 45; i++) {
    particles.push({
      x: x !== undefined && x !== null ? x : window.innerWidth / 2,
      y: y !== undefined && y !== null ? y : window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.7) * 12 - 4,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.25,
      opacity: 1
    });
  }

  let animationFrame;
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.018;

      if (p.opacity > 0) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (active) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  };

  animate();
};

function App() {
  // Smooth Scroll Helper
  const scrollToSection = (id) => {
    playSound('click', isMuted);
    setCurrentPage('home');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const offset = 100;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 150);
  };

  // Global States
  const [flavor, setFlavor] = useState('cheese'); // cheese | chilli | salt
  const [currentPage, setCurrentPage] = useState('home'); // home | catalog
  const [comparedFood, setComparedFood] = useState('chips'); // chips | popcorn | cheese_balls

  // Lo-Fi Cassette Player playlist (Verified 200 OK links)
  const lofiPlaylist = [
    { title: "Lofi Sunset Loop", artist: "SoundHelix 1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Retro City Dreams", artist: "SoundHelix 2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Bihar Wetlands Ambient", artist: "SoundHelix 3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
  ];

  const lofiAudioRef = useRef(null);
  const [lofiIndex, setLofiIndex] = useState(0);
  const [isLofiPlaying, setIsLofiPlaying] = useState(false);
  const [lofiVolume, setLofiVolume] = useState(0.5);
  const [lofiProgress, setLofiProgress] = useState(0);
  const [lofiDuration, setLofiDuration] = useState(0);
  const [lofiCurrentTime, setLofiCurrentTime] = useState(0);

  const formatLofiTime = (secs) => {
    if (isNaN(secs)) return "00:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlayLofi = () => {
    playSound('click', isMuted);
    if (!lofiAudioRef.current) return;
    if (isLofiPlaying) {
      lofiAudioRef.current.pause();
      setIsLofiPlaying(false);
    } else {
      lofiAudioRef.current.play().then(() => {
        setIsLofiPlaying(true);
      }).catch(e => {
        console.error("Lofi playback restricted", e);
      });
    }
  };

  const nextLofiTrack = () => {
    playSound('laser', isMuted);
    let nextIdx = (lofiIndex + 1) % lofiPlaylist.length;
    setLofiIndex(nextIdx);
    setLofiProgress(0);
    setLofiCurrentTime(0);
    if (isLofiPlaying) {
      setTimeout(() => {
        if (lofiAudioRef.current) {
          lofiAudioRef.current.load();
          lofiAudioRef.current.play().catch(e => console.error(e));
        }
      }, 50);
    } else {
      setTimeout(() => {
        if (lofiAudioRef.current) {
          lofiAudioRef.current.load();
        }
      }, 50);
    }
  };

  const prevLofiTrack = () => {
    playSound('laser', isMuted);
    let prevIdx = (lofiIndex - 1 + lofiPlaylist.length) % lofiPlaylist.length;
    setLofiIndex(prevIdx);
    setLofiProgress(0);
    setLofiCurrentTime(0);
    if (isLofiPlaying) {
      setTimeout(() => {
        if (lofiAudioRef.current) {
          lofiAudioRef.current.load();
          lofiAudioRef.current.play().catch(e => console.error(e));
        }
      }, 50);
    } else {
      setTimeout(() => {
        if (lofiAudioRef.current) {
          lofiAudioRef.current.load();
        }
      }, 50);
    }
  };

  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    setLofiProgress(newProgress);
    if (lofiAudioRef.current && lofiAudioRef.current.duration) {
      const newTime = (newProgress / 100) * lofiAudioRef.current.duration;
      lofiAudioRef.current.currentTime = newTime;
      setLofiCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setLofiVolume(newVolume);
    if (lofiAudioRef.current) {
      lofiAudioRef.current.volume = newVolume;
    }
  };
  const comparisonData = {
    makhana: { name: 'Fox & Lotus Makhana', hp: 98, protein: 75, fiber: 85, guilt: 5, status: 'GUILT-FREE EUPHORIA', verdict: 'Clean Protein & Absolute Crunch. S-Tier Snack! 🐐' },
    chips: { name: 'Greasy Potato Chips', hp: 20, protein: 8, fiber: 12, guilt: 95, status: 'CRIPPLING REGRET', verdict: 'Saturated fats & sodium overload. Massive L. 💀' },
    popcorn: { name: 'Heavy Movie Popcorn', hp: 35, protein: 18, fiber: 35, guilt: 75, status: 'BUTTER OVERLOAD', verdict: 'A greasy swamp of heavy oils. Not the vibe. 🧈' },
    cheese_balls: { name: 'Salty Cheese Balls', hp: 15, protein: 5, fiber: 6, guilt: 90, status: 'ORANGE DUST HAZARD', verdict: 'Fake cheese, high empty carbs. Zero stats. 🚫' }
  };
  const [isMuted, setIsMuted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Authentication & Profile States
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('soul_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState(() => {
    const savedUser = localStorage.getItem('soul_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const savedCart = localStorage.getItem(`soul_cart_${parsedUser.phone}`);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedUser = localStorage.getItem('soul_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const savedWishlist = localStorage.getItem(`soul_wishlist_${parsedUser.phone}`);
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    }
    return [];
  });

  const [ordersList, setOrdersList] = useState([]);
  
  const [usersDb, setUsersDb] = useState(() => {
    const saved = localStorage.getItem('soul_users_db');
    return saved ? JSON.parse(saved) : {};
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [loginForm, setLoginForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [smsToast, setSmsToast] = useState({ visible: false, message: '', code: '' });
  const [loginError, setLoginError] = useState('');
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Bulk Customization states
  const [bulkForm, setBulkForm] = useState({ occasion: 'occasions', name: '', email: '', message: '' });
  const [bulkSuccess, setBulkSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailQty, setDetailQty] = useState(1);

  // Checkout States
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [checkoutForm, setCheckoutForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Delhi',
    pin: '',
    phone: ''
  });
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountError, setDiscountError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutOrderId, setCheckoutOrderId] = useState('');

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to load user-specific orders whenever user state changes
  useEffect(() => {
    if (user) {
      const savedOrders = localStorage.getItem(`soul_orders_${user.phone}`);
      setOrdersList(savedOrders ? JSON.parse(savedOrders) : []);
    } else {
      setOrdersList([]);
    }
  }, [user]);

  // Effect to save user-specific cart whenever cart state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`soul_cart_${user.phone}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  // Effect to save user-specific wishlist whenever wishlist state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`soul_wishlist_${user.phone}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const handleAddressChange = (e) => {
    const updatedUser = { ...user, address: e.target.value };
    setUser(updatedUser);
    localStorage.setItem('soul_user', JSON.stringify(updatedUser));
    
    // Also sync to users database
    const updatedDb = { ...usersDb, [user.phone]: updatedUser };
    setUsersDb(updatedDb);
    localStorage.setItem('soul_users_db', JSON.stringify(updatedDb));
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // only allow digits
    setLoginError('');
    setLoginForm(prev => {
      const updated = { ...prev, phone: val };
      if (val.length === 10 && usersDb[val]) {
        updated.name = usersDb[val].name;
        updated.email = usersDb[val].email || '';
        updated.address = usersDb[val].address;
      }
      return updated;
    });
  };

  const handleRequestOtp = (e) => {
    e.preventDefault();
    if (!loginForm.name || !loginForm.email || !loginForm.phone || !loginForm.address) return;
    setLoginError('');
    playSound('laser', isMuted);
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setSmsToast({
      visible: true,
      message: `System access request for ${loginForm.name}. Verify your session to unlock S-Tier snacks.`,
      code: code
    });
    // Auto-dismiss SMS toast after 12 seconds
    setTimeout(() => {
      setSmsToast(prev => {
        if (prev.code === code) {
          return { visible: false, message: '', code: '' };
        }
        return prev;
      });
    }, 12000);
  };

  const handleOtpDigitChange = (value, idx) => {
    const newDigits = [...otpDigits];
    newDigits[idx] = value.slice(-1);
    setOtpDigits(newDigits);
    setLoginError('');
    
    if (value && idx < 3) {
      const nextInput = document.getElementById(`otp-digit-${idx + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (entered === generatedOtp) {
      playSound('laser', isMuted);
      const loggedInUser = { ...loginForm };
      
      // Save user session
      setUser(loggedInUser);
      localStorage.setItem('soul_user', JSON.stringify(loggedInUser));

      // Save to users database
      const updatedDb = { ...usersDb, [loginForm.phone]: loggedInUser };
      setUsersDb(updatedDb);
      localStorage.setItem('soul_users_db', JSON.stringify(updatedDb));

      // Load user specific cart if any exists
      const savedCart = localStorage.getItem(`soul_cart_${loginForm.phone}`);
      setCart(savedCart ? JSON.parse(savedCart) : []);

      // Load user specific wishlist if any exists
      const savedWishlist = localStorage.getItem(`soul_wishlist_${loginForm.phone}`);
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);

      setShowLoginModal(false);
      setOtpSent(false);
      setOtpDigits(['', '', '', '']);
      setSmsToast({ visible: false, message: '', code: '' });
      setLoginError('');
    } else {
      playSound('crunch', isMuted);
      setLoginError("⛔ SYSTEM ACCESS REJECTED: KEYCODE MISMATCH.");
    }
  };

  const [activePolicy, setActivePolicy] = useState(null);
  const [isCartBouncing, setIsCartBouncing] = useState(false);



  const [beholdFeedId, setBeholdFeedId] = useState(() => localStorage.getItem('soul_behold_feed_id') || '');
  const [isFeedLive, setIsFeedLive] = useState(false);
  const [isFeedIdSaved, setIsFeedIdSaved] = useState(false);

  // Keep backup static feed for fallback
  const fallbackFeed = [
    {
      id: '1',
      media_url: imgInstaPost1,
      permalink: 'https://www.instagram.com/p/DZNEIbVz83G/',
      caption: 'Our first offering, Fox & Lotus Makhana, is crafted for those who want better choices without compromising on taste. 🌱',
      pinned: false,
      media_type: 'IMAGE'
    },
    {
      id: '2',
      media_url: imgInstaPost2,
      permalink: 'https://www.instagram.com/p/DOOgru4Eau2/',
      caption: 'Sweet side unlocked: Dark Matter & Gudrush entering the chat 🍫🍯 Either way, with FOX & LOTUS, it’s a risk worth taking.',
      pinned: false,
      media_type: 'IMAGE'
    },
    {
      id: '3',
      media_url: imgInstaPost3,
      permalink: 'https://www.instagram.com/p/DNvC7Cr4tW2/',
      caption: '🦊🪷‼️ LAUNCHING SOON ‼️🪷🦊 Fox & Lotus | SoulFuel Lite',
      pinned: false,
      media_type: 'IMAGE'
    },
    {
      id: '4',
      media_url: imgInstaPost4,
      video_url: videoInstaPost4,
      permalink: 'https://www.instagram.com/p/DM2DUdry49v/',
      caption: 'Cricket’s Hot🥵 The snack’s light 😜 The vibes? Unbeatable💪🏼 SPL 2025 x @soulfuellite — your innings just got upgraded. 😈',
      pinned: false,
      media_type: 'VIDEO'
    },
    {
      id: '5',
      media_url: imgInstaPost5,
      permalink: 'https://www.instagram.com/p/DMxaqr9RHWv/',
      caption: 'PINK CRACK’L ~ Fox & Lotus’s very first roasted premium makhana! 🧂',
      pinned: false,
      media_type: 'IMAGE'
    }
  ];

  // Instagram Feed State (with support for Behold.so dynamic API integration)
  const [instaFeed, setInstaFeed] = useState(fallbackFeed);

  useEffect(() => {
    if (beholdFeedId) {
      fetch(`https://feeds.behold.so/v1/projects/${beholdFeedId}`)
        .then(res => {
          if (!res.ok) throw new Error("Feed request failed");
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const formatted = data.slice(0, 5).map(post => ({
              id: post.id,
              media_type: post.mediaType || 'IMAGE',
              media_url: post.mediaType === 'VIDEO' ? post.thumbnailUrl : (post.mediaUrl || post.thumbnailUrl),
              video_url: post.mediaType === 'VIDEO' ? post.mediaUrl : null,
              permalink: post.permalink || 'https://www.instagram.com/soul_fuel_lite/',
              caption: post.caption || 'Vibe Check ⚡',
              pinned: false
            }));
            setInstaFeed(formatted);
            setIsFeedLive(true);
          } else {
            setInstaFeed(fallbackFeed);
            setIsFeedLive(false);
          }
        })
        .catch(err => {
          console.warn("Dynamic feed load bypassed. Falling back to cropped posts.", err);
          setInstaFeed(fallbackFeed);
          setIsFeedLive(false);
        });
    } else {
      setInstaFeed(fallbackFeed);
      setIsFeedLive(false);
    }
  }, [beholdFeedId]);

  // 3D Card Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Floating "Crunch" Bubbles State
  const [floatingCrunches, setFloatingCrunches] = useState([]);

  // Crunch Active state per flavor
  const [activeCrunchCard, setActiveCrunchCard] = useState(null);

  // Flavor Mixer Slider States
  const [mixCheese, setMixCheese] = useState(50);
  const [mixChilli, setMixChilli] = useState(20);
  const [mixSalt, setMixSalt] = useState(30);
  const [mixName, setMixName] = useState('THE CHEESY SPICE EXPLOSION');
  const [mixScore, setMixScore] = useState(88);

  // Instagram Reels State
  const [reelsLikes, setReelsLikes] = useState(1342);
  const [isReelLiked, setIsReelLiked] = useState(false);
  const [reelComments, setReelComments] = useState([
    { user: 'healthy_snacker', text: 'Literally obsessed with the Cheese & Herbs flavor! 😍🌱', time: '2m' },
    { user: 'gym_freak_99', text: '70g pack fits perfectly in my daily macros. Clean crunch! 🔥💪', time: '5m' },
    { user: 'crunch_queen', text: 'ASMR level: 1000/10. So crisp!', time: '12m' }
  ]);
  const [newComment, setNewComment] = useState('');
  const [floatingReactions, setFloatingReactions] = useState([]);

  // Carousel State
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselSlides = [
    {
      title: "The Mud-Quest: 4 AM Wetland Raid",
      tagline: "LEVEL 1: WETLAND EXCAVATION",
      desc: "Before the sun even boots up, our Mithila harvest-hunters dive headfirst into 4-foot deep sub-tropical wetlands. They manually sweep the mud floor to gather raw black lotus seeds. It's a high-difficulty physical raid—pure handpicked respect, zero machinery allowed.",
      img: imgHarvest,
      accent: "#15803d"
    },
    {
      title: "The Popping Boss Fight",
      tagline: "LEVEL 2: EXTREME WOODFIRE BAKE",
      desc: "Raw seeds are roasted over extreme woodfire flames in iron pans until their shells are ready to explode. With split-second timing, workers smash the shells with wooden hammers. BOOM! The seeds pop open into light-speed white kernels. 100% air-popped, zero oil fryer shortcuts.",
      img: imgPopping,
      accent: "#d97706"
    },
    {
      title: "Swirling the Golden Glaze",
      tagline: "LEVEL 3: THE SAUCE INFUSION",
      desc: "The popped kernels are spun through misting drums where cold-pressed olive oils and small-batch organic spices wrap every single crevice. Out comes a high-protein, zero-guilt S-Tier item, seasoned to perfection and ready to equip to your hunger slot.",
      img: imgDrip,
      accent: "#db2777"
    }
  ];

  // Carousel Auto Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Update Body Attribute for Dynamic Theme Switcher
  useEffect(() => {
    document.body.setAttribute('data-flavor', flavor);
  }, [flavor]);

  // Recalculate Custom Mix Name & Score
  useEffect(() => {
    const total = Number(mixCheese) + Number(mixChilli) + Number(mixSalt);
    let name = "HYPER BLEND PROTOTOYPE";
    let score = 90;

    if (mixCheese > 60 && mixChilli < 30) {
      name = "CREAMY HERB NECTAR";
      score = 92;
    } else if (mixChilli > 60 && mixCheese < 30) {
      name = "VOLCANIC HONEY DRIZZLE";
      score = 95;
    } else if (mixSalt > 60 && mixChilli < 30) {
      name = "CYBER MOUNTAIN DRIFT";
      score = 89;
    } else if (mixCheese > 30 && mixChilli > 30 && mixSalt > 30) {
      name = "TRIPPY TRIPLE TRIP";
      score = 97;
    } else {
      name = "SOUL SNACK BALANCE";
      score = 91;
    }

    setMixName(name);
    setMixScore(Math.min(99, Math.round(score + (total % 5))));
  }, [mixCheese, mixChilli, mixSalt]);

  // Mouse Move Tilt Effect
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Normalize tilt angles (-15deg to 15deg)
    const tiltX = (mouseY / (height / 2)) * -12;
    const tiltY = (mouseX / (width / 2)) * 12;

    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Sound and crunch triggered logic
  const triggerCrunchText = (e, flavorName) => {
    playSound('crunch', isMuted);

    // Create floating crunch text
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newBubble = {
      id: Date.now() + Math.random(),
      text: flavorName === 'cheese' ? 'CRUNCH! 🧀🌱' : flavorName === 'chilli' ? 'HOT! 🌶️🍯' : 'POP! 🏔️✨',
      x,
      y
    };

    setFloatingCrunches((prev) => [...prev, newBubble]);

    // Shake Card State
    setActiveCrunchCard(flavorName);
    setTimeout(() => setActiveCrunchCard(null), 400);

    // Auto clean floating texts
    setTimeout(() => {
      setFloatingCrunches((prev) => prev.filter(b => b.id !== newBubble.id));
    }, 1200);
  };

  // Cart Functions
  const addToCart = (product, e = null) => {
    if (!user) {
      playSound('laser', isMuted);
      setShowLoginModal(true);
      return;
    }
    playSound('laser', isMuted);

    // Trigger confetti explosion
    if (e && e.clientX && e.clientY) {
      triggerConfetti(e.clientX, e.clientY);
    } else {
      triggerConfetti();
    }

    // Trigger cart bounce animation
    setIsCartBouncing(true);
    setTimeout(() => {
      setIsCartBouncing(false);
    }, 600);

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    // Automatically slide out the basket briefly to show confirmation
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    playSound('click', isMuted);
    setCart(cart.filter(item => item.id !== id));
  };

  const updateCartQty = (id, change) => {
    playSound('click', isMuted);
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + change;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const toggleWishlist = (product) => {
    playSound('click', isMuted);
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    const exists = wishlist.find(item => item.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // Instagram simulated heart reactions
  const sendReelReaction = (emoji) => {
    playSound('click', isMuted);
    if (emoji === '💖') {
      setReelsLikes(prev => prev + (isReelLiked ? -1 : 1));
      setIsReelLiked(!isReelLiked);
    }

    const newReact = {
      id: Date.now(),
      emoji,
      left: Math.random() * 80 + 10, // 10% to 90%
    };

    setFloatingReactions(prev => [...prev, newReact]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== newReact.id));
    }, 2000);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    playSound('laser', isMuted);
    setReelComments([{ user: 'anonymous_soul', text: newComment, time: '1s' }, ...reelComments]);
    setNewComment('');
  };


  // Dynamic Product details based on current theme flavor
  const products = [
    {
      id: 'cheese',
      name: 'Cheese & Herbs',
      flavorName: 'cheese',
      image: packCheese,
      desc: 'Infused with organic cheddar cheese and loaded with premium aromatic herbs. Fully popped for crunch.',
      price: 180,
      weight: '70g',
      calories: '280 kcal',
      color: '#ffd15c',
      accent: '#a3e635',
      flavorDetails: { primaryName: 'Cheddar Cheese Powder', primaryPct: 80, secondaryName: 'Parsley & Oregano Herbs', secondaryPct: 20 },
      healthStats: { hp: 98, protein: '9.2g', fiber: '4.8g', guilt: 5 },
      offerCode: 'CHEESYDRIP',
      offerLabel: 'Flat 15% OFF + 2x Level XP Points'
    },
    {
      id: 'chilli',
      name: 'Honey Chilli',
      flavorName: 'chilli',
      image: packChilli,
      desc: 'The perfect kick of wild honey sweetness intertwined with spicy, slow-baked red chilli flakes.',
      price: 195,
      weight: '70g',
      calories: '290 kcal',
      color: '#e11d48',
      accent: '#f59e0b',
      flavorDetails: { primaryName: 'Organic Wild Honey', primaryPct: 70, secondaryName: 'Crushed Red Chilli Flakes', secondaryPct: 30 },
      healthStats: { hp: 95, protein: '8.8g', fiber: '4.5g', guilt: 8 },
      offerCode: 'SWEETHEAT',
      offerLabel: 'Buy 2 Get 1 FREE on Honey Chilli cups'
    },
    {
      id: 'salt',
      name: 'Himalayan Pink Salt',
      flavorName: 'salt',
      image: packSalt,
      desc: 'Freshly seasoned with genuine, raw pink salt hand-mined from high Himalayan peaks. Organic mineral dense.',
      price: 165,
      weight: '70g',
      calories: '260 kcal',
      color: '#ec4899',
      accent: '#06b6d4',
      flavorDetails: { primaryName: 'Raw Himalayan Pink Salt', primaryPct: 95, secondaryName: 'Cold-Pressed Olive Drizzle', secondaryPct: 5 },
      healthStats: { hp: 99, protein: '9.5g', fiber: '5.2g', guilt: 2 },
      offerCode: 'SALTYVIBES',
      offerLabel: 'Flat ₹30 OFF returning orders'
    }
  ];

  const currentThemeProduct = products.find(p => p.flavorName === flavor) || products[0];

  return (
    <div className="app-container">

      <header className="neo-box" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.4)' : 'var(--theme-card-bg)',
        backdropFilter: isScrolled ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(8px)' : 'none',
        borderWidth: '0 0 var(--border-width) 0',
        borderRadius: 0,
        boxShadow: 'none',
        transition: 'background-color 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease'
      }}>
        <div className="site-wrapper" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '90px'
        }}>
          {/* Brand Logo Combos */}
          <div className="navbar-logos" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => {
              playSound('click', isMuted);
              setCurrentPage('home');
              window.scrollTo(0, 0);
            }}
            onMouseEnter={() => playSound('hover', isMuted)}>
            {/* Soul Fuel Logo */}
            <div className="logo-container" style={{
              height: '56px',
              borderRadius: '50%',
              border: 'var(--neo-border-thin)',
              backgroundColor: '#000',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '2px 2px 0 #000'
            }}>
              <img src={logoSoulFuel} alt="Soul Fuel Lite Logo" style={{ height: '100%', objectFit: 'contain' }} />
            </div>

            {/* Parent company text (Y2K Tech style) */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ 
                fontFamily: 'var(--font-header)', 
                fontSize: '1.25rem', 
                fontWeight: 900, 
                color: 'var(--theme-accent-dark)', 
                letterSpacing: '1px',
                lineHeight: 1
              }}>
                SOUL FUEL LITE
              </span>
            </div>
          </div>

          {/* Nav Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Gen Z Text Navigation Links */}
            <button
              onClick={() => scrollToSection('lore-section')}
              onMouseEnter={() => playSound('hover', isMuted)}
              className="y2k-nav-link desktop-only"
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-tech)',
                fontWeight: 900,
                fontSize: '0.8rem',
                letterSpacing: '1px',
                color: '#000',
                cursor: 'pointer',
                textTransform: 'uppercase',
                marginRight: '8px',
                transition: 'color 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              About Us
            </button>
            
            <button
              onClick={() => {
                playSound('click', isMuted);
                setCurrentPage('customized');
                window.scrollTo(0, 0);
              }}
              onMouseEnter={() => playSound('hover', isMuted)}
              className="y2k-nav-link desktop-only"
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-tech)',
                fontWeight: 900,
                fontSize: '0.8rem',
                letterSpacing: '1px',
                color: '#000',
                cursor: 'pointer',
                textTransform: 'uppercase',
                marginRight: '16px',
                transition: 'color 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Customized for You
            </button>

            {/* Dynamic Sound FX Controller */}
            <button
              className="neo-box-interactive"
              onClick={() => {
                setIsMuted(!isMuted);
                playSound('click', false);
              }}
              onMouseEnter={() => playSound('hover', isMuted)}
              style={{
                width: '46px',
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isMuted ? '#f3f4f6' : 'var(--theme-accent)',
                boxShadow: '3px 3px 0 #000',
                border: 'var(--neo-border-thin)',
                cursor: 'pointer'
              }}
              title={isMuted ? "Unmute Retro Synthesizer Sounds" : "Mute Sound Effects"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
            </button>

            {/* Profile Button (only if logged in) */}
            {user && (
              <button
                className="neo-btn"
                onClick={() => {
                  playSound('click', isMuted);
                  setShowProfileModal(true);
                }}
                onMouseEnter={() => playSound('hover', isMuted)}
                style={{
                  padding: '10px 18px',
                  fontSize: '0.9rem',
                  boxShadow: '3px 3px 0 #000',
                  backgroundColor: 'var(--theme-accent)',
                  color: '#000'
                }}
              >
                👤 PROFILE
              </button>
            )}

            {/* Shopping Basket Button */}
            <button
              className={`neo-btn ${isCartBouncing ? 'cart-bounce-active' : ''}`}
              onClick={() => {
                playSound('click', isMuted);
                if (!user) {
                  setShowLoginModal(true);
                } else {
                  setIsCartOpen(true);
                }
              }}
              onMouseEnter={() => playSound('hover', isMuted)}
              style={{
                padding: '10px 18px',
                fontSize: '0.9rem',
                boxShadow: '3px 3px 0 #000'
              }}
            >
              <ShoppingCart size={18} />
              <span className="desktop-only">MY BASKET</span>
              <span style={{
                backgroundColor: '#000',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '99px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                marginLeft: '4px'
              }}>{totalItems}</span>
            </button>
          </div>
        </div>
      </header>

      {currentPage === 'home' && (
        <>
          {/* 2. DYNAMIC HERO SECTION (PSYCHEDELIC POP ART + NEO BRUTALIST) */}
      <section className="y2k-grid" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Floating Background Cyber shapes */}
        <div className="organic-blob animate-float-slow desktop-only" style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '120px',
          height: '120px',
          background: 'var(--theme-accent)',
          opacity: 0.3,
          zIndex: 0
        }}></div>
        <div className="y2k-starburst animate-rotate desktop-only" style={{
          position: 'absolute',
          bottom: '15%',
          right: '5%',
          fontSize: '3rem',
          color: 'var(--theme-secondary)',
          opacity: 0.4,
          zIndex: 0
        }}>✦</div>

        <div className="site-wrapper hero-grid" style={{ position: 'relative', zIndex: 1 }}>

          {/* Left Hero Column: Psychedelic bold copy & switches */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            {/* Trippy Clashing Big Title */}
            <h1 className="y2k-chrome-text" style={{
              fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
              fontWeight: 900,
              lineHeight: 0.85,
              marginBottom: '16px',
              fontFamily: 'var(--font-header)',
              textShadow: '5px 5px 0px var(--color-black)'
            }}>
              FOX &<br />
              <span style={{ color: 'var(--theme-accent)', WebkitTextFillColor: 'var(--theme-accent)', fontSize: '0.9em' }}>LOTUS</span>
            </h1>

            <p style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              lineHeight: 1.3,
              marginBottom: '32px',
              maxWidth: '520px',
              fontFamily: 'var(--font-body)',
              color: 'var(--theme-text)'
            }}>
              Unleash the ultimate crispy crunch! Slow-roasted, air-popped lotus seed makhanas made to charge your soul with clean protein, low calories, and zero junk.
            </p>

            {/* Flavor Interactive Switches */}
            <div style={{ width: '100%', marginBottom: '40px' }}>
              <span style={{
                fontFamily: 'var(--font-tech)',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'block',
                marginBottom: '12px',
                letterSpacing: '1px'
              }}>SELECT YOUR ACTIVE SOUL STATE:</span>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                maxWidth: '480px'
              }}>
                {/* Switch 1: Cheese */}
                <button
                  onClick={() => { playSound('laser', isMuted); setFlavor('cheese'); }}
                  onMouseEnter={() => playSound('hover', isMuted)}
                  className={`neo-box-interactive ${flavor === 'cheese' ? 'active-flavor-btn' : ''}`}
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    backgroundColor: flavor === 'cheese' ? '#fff' : '#ffd15c',
                    border: 'var(--neo-border)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    boxShadow: flavor === 'cheese' ? '3px 3px 0 #000' : '5px 5px 0 #000',
                    transform: flavor === 'cheese' ? 'translate(2px, 2px)' : 'none'
                  }}
                >
                  🧀 CHEESE & HERBS
                </button>

                {/* Switch 3: Pink Salt */}
                <button
                  onClick={() => { playSound('laser', isMuted); setFlavor('salt'); }}
                  onMouseEnter={() => playSound('hover', isMuted)}
                  className={`neo-box-interactive ${flavor === 'salt' ? 'active-flavor-btn' : ''}`}
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    backgroundColor: flavor === 'salt' ? '#fff' : '#ec4899',
                    border: 'var(--neo-border)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    boxShadow: flavor === 'salt' ? '3px 3px 0 #000' : '5px 5px 0 #000',
                    transform: flavor === 'salt' ? 'translate(2px, 2px)' : 'none'
                  }}
                >
                  🏔️ PINK SALT
                </button>
              </div>
            </div>

            {/* Quick Hero Actions */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                className="neo-btn"
                onClick={(e) => addToCart(currentThemeProduct, e)}
                onMouseEnter={() => playSound('hover', isMuted)}
                style={{ fontSize: '1rem', padding: '16px 36px' }}
              >
                <ShoppingCart size={20} />
                ADD TO BAG (NOCAP) - ₹{currentThemeProduct.price}
              </button>
              <button
                onClick={() => {
                  playSound('click', isMuted);
                  setCurrentPage('catalog');
                  window.scrollTo(0, 0);
                }}
                onMouseEnter={() => playSound('hover', isMuted)}
                className="neo-btn"
                style={{
                  backgroundColor: '#fff',
                  color: '#000',
                  fontSize: '1rem',
                  padding: '16px 28px'
                }}>
                EXPLORE ALL ✦
              </button>
            </div>

          </div>

          {/* Right Hero Column: Interactive 3D perspective floating makhana pack */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>

            {/* Psychedelic concentric backdrop rings */}
            <div className="animate-rotate" style={{
              position: 'absolute',
              width: '120%',
              height: '120%',
              top: '-10%',
              left: '-10%',
              background: 'repeating-radial-gradient(circle, rgba(0,0,0,0.02), rgba(0,0,0,0.02) 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 40px)',
              borderRadius: '50%',
              zIndex: 0,
              pointerEvents: 'none'
            }}></div>

            {/* Interactive 3D Tilt Card Frame */}
            <div
              className="neo-box"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => {
                triggerCrunchText(e, flavor);
              }}
              style={{
                width: '100%',
                maxWidth: '430px',
                padding: '24px',
                borderRadius: '24px',
                background: 'var(--theme-card-bg)',
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`,
                transition: tilt.x === 0 ? 'transform 0.5s ease' : 'none',
                zIndex: 1,
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              {/* Starburst badge floating inside card */}
              <div className="neo-box animate-float" style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                padding: '8px 16px',
                backgroundColor: 'var(--theme-accent)',
                color: '#000',
                fontWeight: 900,
                fontSize: '0.8rem',
                border: 'var(--neo-border)',
                transform: 'rotate(8deg)',
                zIndex: 5,
                boxShadow: '3px 3px 0 #000'
              }}>
                100% ORGANIC ✦
              </div>

              {/* High resolution product pack display */}
              <div style={{
                border: 'var(--neo-border)',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#000',
                position: 'relative',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
              }}>
                <img
                  src={currentThemeProduct.image}
                  alt={currentThemeProduct.name}
                  style={{
                    width: '100%',
                    height: '420px',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s ease'
                  }}
                  className={activeCrunchCard === flavor ? 'crunching' : ''}
                />

                {/* Playful prompt overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  padding: '6px 16px',
                  borderRadius: '99px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Award size={14} className="animate-spin" style={{ color: 'var(--theme-accent)' }} />
                  TAP PACK TO CRUNCH TEST
                </div>

                {/* Floating "Crunch" Bubbles Renderer */}
                {floatingCrunches.map(bubble => (
                  <div key={bubble.id} className="neo-box" style={{
                    position: 'absolute',
                    left: `${bubble.x}px`,
                    top: `${bubble.y}px`,
                    transform: 'translate(-50%, -100%) scale(1.1)',
                    backgroundColor: 'var(--theme-accent)',
                    color: '#000',
                    border: 'var(--neo-border-thin)',
                    padding: '4px 10px',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    boxShadow: '3px 3px 0 #000',
                    pointerEvents: 'none',
                    zIndex: 10,
                    animation: 'float 0.8s ease-out forwards'
                  }}>
                    {bubble.text}
                  </div>
                ))}
              </div>

              {/* Product Metadata Info (Y2K retro console style) */}
              <div style={{
                marginTop: '16px',
                textAlign: 'left',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                borderTop: 'var(--neo-border-thin)',
                paddingTop: '16px'
              }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.7rem', color: 'var(--theme-text-light)', display: 'block', fontWeight: 800 }}>ACTIVE CALORIES</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-header)' }}>{currentThemeProduct.calories}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.7rem', color: 'var(--theme-text-light)', display: 'block', fontWeight: 800 }}>WEIGHT UNIT</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-header)' }}>{currentThemeProduct.weight}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. RUNNING MARQUEE TICKER TAPE (Y2K / RETRO FUTURIST) */}
      <div className="marquee-container">
        <div className="marquee-content">
          <span className="marquee-item">✦ 100% ORGANIC BAKE</span>
          <span className="marquee-item">✦ RICH IN PLANT PROTEIN <span>💪</span></span>
          <span className="marquee-item">✦ GLUTEN-FREE EUPHORIA</span>
          <span className="marquee-item">✦ NO ARTIFICIAL JUNK <span>🚫</span></span>
          <span className="marquee-item">✦ LOW CALORIE, HIGH CRUNCH</span>
          <span className="marquee-item">✦ SOUL FUEL FOR ACTIVE MINDS <span>🧠</span></span>
          <span className="marquee-item">✦ BORN IN BIHAR WETLANDS</span>
          <span className="marquee-item">✦ SLOW PAN-ROASTED ARTISAN SEEDS</span>
        </div>
      </div>


        </>
      )}

      {/* 4. PRODUCT SHOWCASE (EXPERIMENTAL E-COMMERCE CARDS) */}
      {currentPage === 'catalog' && (
        <section id="products-showcase" style={{
          padding: '80px 0 100px 0',
          backgroundColor: 'var(--color-cream)',
          borderBottom: 'var(--neo-border)'
        }}>
        <div className="site-wrapper">
          {/* Header Area */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{
              fontFamily: 'var(--font-tech)',
              fontWeight: 800,
              fontSize: '0.9rem',
              color: 'var(--theme-accent-dark)',
              letterSpacing: '2px',
              display: 'block',
              marginBottom: '8px'
            }}>THE FOX & LOTUS CATALOGUE</span>

            <h2 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 900,
              color: '#000',
              fontFamily: 'var(--font-header)',
              textShadow: '2px 2px 0 var(--theme-bg)'
            }}>
              EXPLORE OUR FLAVOR MATRIX
            </h2>
            <div style={{
              width: '80px',
              height: '8px',
              backgroundColor: '#000',
              margin: '16px auto 0 auto',
              boxShadow: '4px 4px 0 var(--theme-accent)'
            }}></div>
          </div>

          {/* Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px'
          }}>
            {products.map((prod) => (
              <div
                key={prod.id}
                className="neo-box"
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  backgroundColor: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  border: 'var(--neo-border)',
                  boxShadow: activeCrunchCard === prod.id ? '3px 3px 0 #000' : '6px 6px 0 #000',
                  transform: activeCrunchCard === prod.id ? 'translate(3px, 3px)' : 'none',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease'
                }}
              >
                {/* Floating Flavor state trigger indicators */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <span className="neo-box" style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    backgroundColor: prod.color,
                    color: prod.flavorName === 'chilli' ? '#fff' : '#000',
                    border: 'var(--neo-border-thin)',
                    boxShadow: '2px 2px 0 #000',
                    transform: 'rotate(-3deg)'
                  }}>
                    {prod.weight} PACK
                  </span>
                </div>

                {/* Pack Image with click to detail page */}
                <div
                  onClick={(e) => {
                    triggerCrunchText(e, prod.flavorName);
                    setTimeout(() => {
                      setSelectedProduct(prod);
                      setDetailQty(1);
                      setCurrentPage('product-detail');
                      window.scrollTo(0, 0);
                    }, 150);
                  }}
                  className="catalog-product-card-image-wrap"
                  style={{
                    border: 'var(--neo-border)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  {/* Floating Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prod);
                    }}
                    onMouseEnter={() => playSound('hover', isMuted)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: wishlist.find(w => w.id === prod.id) ? '#ff0055' : 'rgba(0,0,0,0.8)',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1.5px solid #000',
                      boxShadow: '1.5px 1.5px 0 #000',
                      cursor: 'pointer',
                      zIndex: 10,
                      padding: 0
                    }}
                  >
                    <Heart size={14} fill={wishlist.find(w => w.id === prod.id) ? "#fff" : "none"} />
                  </button>
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={{
                      width: '100%',
                      height: '280px',
                      objectFit: 'contain',
                      display: 'block',
                      transition: 'transform 0.3s ease'
                    }}
                    className={`catalog-product-img ${activeCrunchCard === prod.id ? 'crunching' : ''}`}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <Star size={14} style={{ color: prod.color }} className="animate-spin" />
                  </div>
                </div>

                {/* Card copy */}
                <div style={{ textAlign: 'left', marginTop: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      marginBottom: '8px',
                      color: '#000',
                      fontFamily: 'var(--font-header)',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setSelectedProduct(prod);
                      setDetailQty(1);
                      setCurrentPage('product-detail');
                      window.scrollTo(0, 0);
                    }}
                  >
                    {prod.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* PRODUCT DETAIL PAGE */}
      {currentPage === 'product-detail' && selectedProduct && (
        <section className="product-detail-page-section" style={{
          padding: '80px 0 120px 0',
          backgroundColor: 'var(--theme-bg)',
          color: 'var(--theme-text)',
          minHeight: '100vh',
          position: 'relative'
        }}>
          {/* Y2K Grid Overlay */}
          <div className="y2k-grid" style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}></div>
          
          <div className="site-wrapper" style={{ position: 'relative', zIndex: 2 }}>
            {/* Back Button */}
            <button
              onClick={() => { playSound('click', isMuted); setCurrentPage('catalog'); }}
              onMouseEnter={() => playSound('hover', isMuted)}
              className="neo-btn"
              style={{
                marginBottom: '40px',
                padding: '10px 20px',
                fontSize: '0.9rem',
                boxShadow: '3px 3px 0 #000'
              }}
            >
              ← BACK TO CATALOG
            </button>

            {/* Split Page Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(320px, 1.5fr)',
              gap: '48px',
              alignItems: 'start'
            }}>
              {/* Left Column: Image and Nutrition */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Big Image Card */}
                <div className="neo-box" style={{
                  padding: '24px',
                  backgroundColor: '#fff',
                  borderRadius: '24px',
                  boxShadow: '10px 10px 0 #000',
                  border: 'var(--neo-border)'
                }}>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '480px',
                      objectFit: 'contain',
                      borderRadius: '12px',
                      display: 'block'
                    }}
                  />
                </div>

                {/* Nutrition Facts Table */}
                <div className="neo-box" style={{
                  padding: '24px',
                  backgroundColor: '#fff',
                  borderRadius: '24px',
                  boxShadow: '10px 10px 0 #000',
                  border: 'var(--neo-border)',
                  color: '#000',
                  textAlign: 'left'
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-header)',
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    borderBottom: 'var(--neo-border-thin)',
                    paddingBottom: '8px',
                    marginBottom: '16px',
                    textTransform: 'uppercase'
                  }}>
                    Nutrition Facts
                  </h3>
                  <div style={{ fontSize: '0.85rem', marginBottom: '12px', color: '#4b5563' }}>
                    Serving Size: 20g | Servings Per Pack: 4
                  </div>

                  {/* Table values */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-tech)' }}>
                    {[
                      { label: 'Energy', val: selectedProduct.id === 'cheese' ? '538.72 Kcal' : selectedProduct.id === 'chilli' ? '545.20 Kcal' : '520.10 Kcal' },
                      { label: 'Protein', val: selectedProduct.healthStats.protein },
                      { label: 'Carbohydrate', val: '61.12 g' },
                      { label: 'Total Sugar', val: '0.50 g' },
                      { label: 'Added Sugar', val: '0.00 g' },
                      { label: 'Dietary Fiber', val: selectedProduct.healthStats.fiber },
                      { label: 'Total Fat', val: '29.16 g' },
                      { label: 'Saturated Fat', val: '13.65 g' },
                      { label: 'Trans Fat', val: '0.00 g' },
                      { label: 'Cholesterol', val: '0.00 mg' },
                      { label: 'Sodium', val: selectedProduct.id === 'cheese' ? '772.00 mg' : selectedProduct.id === 'chilli' ? '820.00 mg' : '850.00 mg' },
                      { label: 'Calcium', val: '56.00 mg' },
                      { label: 'Vitamin D as D3', val: '49.0 IU' }
                    ].map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #e5e7eb',
                        paddingBottom: '4px',
                        fontWeight: 'bold'
                      }}>
                        <span>{item.label}</span>
                        <span>{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Title, Controls, Buy options, and Description */}
              <div className="neo-box" style={{
                padding: '40px 32px',
                backgroundColor: 'var(--theme-card-bg)',
                color: 'var(--theme-text)',
                borderRadius: '24px',
                boxShadow: '10px 10px 0 var(--theme-shadow-color)',
                border: 'var(--neo-border)',
                textAlign: 'left'
              }}>
                <h1 style={{
                  fontFamily: 'var(--font-header)',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                  marginBottom: '12px'
                }}>
                  {selectedProduct.name}
                </h1>
                
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  marginBottom: '24px',
                  fontFamily: 'var(--font-tech)'
                }}>
                  ₹{selectedProduct.price}.00
                </div>

                {/* Weight selection dropdown */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-tech)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    marginBottom: '8px',
                    textTransform: 'uppercase'
                  }}>Select Weight</label>
                  <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                    <select
                      className="login-input"
                      style={{
                        width: '100%',
                        appearance: 'none',
                        cursor: 'pointer',
                        padding: '12px 16px',
                        fontSize: '0.95rem',
                        fontWeight: 'bold',
                        border: 'var(--neo-border-thin)',
                        borderRadius: '12px',
                        backgroundColor: '#fff',
                        color: '#000',
                        outline: 'none'
                      }}
                    >
                      <option>{selectedProduct.weight} - Standard Pack</option>
                      <option>{selectedProduct.weight === '70g' ? '140g' : '90g'} - Double Pack</option>
                    </select>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      right: '16px',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#000',
                      fontWeight: 'bold'
                    }}>
                      ▼
                    </div>
                  </div>
                </div>

                {/* Quantity selector */}
                <div style={{ marginBottom: '32px' }}>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-tech)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    marginBottom: '8px',
                    textTransform: 'uppercase'
                  }}>Quantity</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => { playSound('click', isMuted); setDetailQty(prev => Math.max(1, prev - 1)); }}
                      className="neo-box-interactive"
                      style={{
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        color: '#000',
                        border: 'var(--neo-border-thin)',
                        boxShadow: '2px 2px 0 #000',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}
                    >-</button>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, minWidth: '24px', textAlign: 'center' }}>{detailQty}</span>
                    <button
                      onClick={() => { playSound('click', isMuted); setDetailQty(prev => prev + 1); }}
                      className="neo-box-interactive"
                      style={{
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        color: '#000',
                        border: 'var(--neo-border-thin)',
                        boxShadow: '2px 2px 0 #000',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}
                    >+</button>
                  </div>
                </div>

                {/* Cart Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                  <button
                    onClick={(e) => {
                      playSound('crunch', isMuted);
                      for (let i = 0; i < detailQty; i++) {
                        addToCart(selectedProduct, e);
                      }
                      setDetailQty(1);
                    }}
                    className="neo-btn"
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '1.1rem',
                      justifyContent: 'center',
                      boxShadow: '4px 4px 0 #000'
                    }}
                  >
                    ADD TO CART - ₹{(selectedProduct.price * detailQty).toFixed(2)}
                  </button>

                  <button
                    onClick={() => {
                      playSound('crunch', isMuted);
                      setCheckoutItems([{
                        ...selectedProduct,
                        qty: detailQty,
                        selectedWeight: selectedProduct.weight + ' - Standard Pack'
                      }]);
                      setCheckoutSuccess(false);
                      setAppliedDiscount(0);
                      setDiscountCode('');
                      setDiscountError('');
                      setCurrentPage('checkout');
                      window.scrollTo(0, 0);
                    }}
                    className="neo-btn"
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '1.1rem',
                      justifyContent: 'center',
                      backgroundColor: '#22c55e',
                      color: '#000',
                      boxShadow: '4px 4px 0 #000'
                    }}
                  >
                    BUY IT NOW
                  </button>
                </div>

                {/* Description & Ingredients */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <h4 style={{
                      fontFamily: 'var(--font-header)',
                      fontSize: '1.1rem',
                      fontWeight: 900,
                      marginBottom: '8px',
                      textTransform: 'uppercase'
                    }}>
                      Description
                    </h4>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      lineHeight: 1.45,
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      color: 'var(--theme-text-light)',
                      margin: 0
                    }}>
                      {selectedProduct.desc.toUpperCase()}
                    </p>
                  </div>

                  <div>
                    <h4 style={{
                      fontFamily: 'var(--font-header)',
                      fontSize: '1.1rem',
                      fontWeight: 900,
                      marginBottom: '8px',
                      textTransform: 'uppercase'
                    }}>
                      Ingredients
                    </h4>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      lineHeight: 1.4,
                      color: 'var(--theme-text-light)',
                      margin: 0
                    }}>
                      Makhana (Popped Lotus Seeds) 70%, Olive Oil 18%, Spices & Condiments 10% (Red Chilli, Dried Onion Flakes, Parsley, Oregano, Black Pepper) Salt, {selectedProduct.flavorDetails.primaryName} Powder, Maltodextrin, Butter Concentrate, Acidity Regulator (Citric Acid E330), Flavour Enhancer.
                    </p>
                  </div>

                  {/* Theme Badges */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginTop: '16px',
                    borderTop: 'var(--neo-border-thin)',
                    paddingTop: '24px'
                  }}>
                    {['NON GMO', 'GLUTEN FREE', 'ROASTED IN OLIVE', 'ANTI OXIDANTS', 'NO ADDITIVES'].map((badge, idx) => (
                      <span key={idx} className="neo-box" style={{
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        backgroundColor: '#fff',
                        color: '#000',
                        border: 'var(--neo-border-thin)',
                        boxShadow: '2px 2px 0 #000',
                        borderRadius: '8px'
                      }}>
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CHECKOUT PAGE */}
      {currentPage === 'checkout' && checkoutItems.length > 0 && (
        <section className="checkout-page-section" style={{
          padding: '80px 0 120px 0',
          backgroundColor: 'var(--color-cream)',
          color: '#000',
          minHeight: '100vh',
          position: 'relative'
        }}>
          {/* Y2K Dot overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.05,
            backgroundImage: 'radial-gradient(#000 20%, transparent 20%)',
            backgroundSize: '15px 15px',
            pointerEvents: 'none'
          }}></div>

          <div className="site-wrapper" style={{ position: 'relative', zIndex: 2 }}>
            
            {/* Back Nav */}
            <button
              onClick={() => {
                playSound('click', isMuted);
                if (checkoutItems.length > 1 || !selectedProduct) {
                  setCurrentPage('catalog');
                } else {
                  setCurrentPage('product-detail');
                }
              }}
              onMouseEnter={() => playSound('hover', isMuted)}
              className="neo-btn"
              style={{
                marginBottom: '40px',
                padding: '10px 20px',
                fontSize: '0.9rem',
                boxShadow: '3px 3px 0 #000'
              }}
            >
              {(checkoutItems.length > 1 || !selectedProduct) ? '← BACK TO CATALOG' : '← BACK TO PRODUCT'}
            </button>

            {checkoutSuccess ? (
              /* Success Page / Order Placed receipt */
              <div className="neo-box" style={{
                maxWidth: '680px',
                margin: '0 auto',
                padding: '50px 30px',
                backgroundColor: 'var(--theme-card-bg)',
                color: 'var(--theme-text)',
                borderRadius: '24px',
                boxShadow: '8px 8px 0px var(--theme-shadow-color)',
                border: 'var(--neo-border)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
                <h2 style={{
                  fontFamily: 'var(--font-header)',
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  marginBottom: '16px'
                }}>Order Placed Successfully!</h2>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: 'var(--theme-text-light)',
                  marginBottom: '24px',
                  lineHeight: 1.4
                }}>
                  Thank you for claiming the crunch! Your payment has been securely initialized via Razorpay.
                </p>
                <div style={{
                  border: 'var(--neo-border-thin)',
                  borderRadius: '12px',
                  padding: '20px',
                  backgroundColor: '#fff',
                  color: '#000',
                  textAlign: 'left',
                  marginBottom: '32px'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>ORDER REFERENCE: {checkoutOrderId}</div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>DELIVERY TO: {checkoutForm.firstName} {checkoutForm.lastName}</div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>ADDRESS: {checkoutForm.address}, {checkoutForm.city}, {checkoutForm.state} - {checkoutForm.pin}</div>
                  <div style={{ fontWeight: 'bold' }}>CONTACT EMAIL: {checkoutForm.email}</div>
                </div>
                <button
                  className="neo-btn"
                  onClick={() => { playSound('laser', isMuted); setCurrentPage('catalog'); setCheckoutItems([]); }}
                  style={{ boxShadow: '4px 4px 0 #000' }}
                >
                  RETURN TO CATALOG
                </button>
              </div>
            ) : (
              /* Checkout form split view */
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr',
                gap: '48px',
                alignItems: 'start'
              }}>
                {/* Left Column: Contact, Delivery, Payment */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    playSound('laser', isMuted);
                    triggerConfetti();

                    const orderId = `SOUL-${Math.floor(100000 + Math.random() * 900000)}`;
                    setCheckoutOrderId(orderId);
                    
                    // Create order record
                    const baseSubtotal = checkoutItems.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
                    const finalSubtotal = baseSubtotal * (1 - appliedDiscount);
                    const shippingCost = finalSubtotal >= 500 ? 0 : 40;
                    const finalTotal = finalSubtotal + shippingCost;

                    const newOrder = {
                      id: orderId,
                      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                      items: checkoutItems.map(item => `${item.qty}x ${item.name}`).join(', '),
                      total: finalTotal.toFixed(2),
                      status: 'ROASTING'
                    };
                    const updatedOrders = [newOrder, ...ordersList];
                    setOrdersList(updatedOrders);
                    if (user) {
                      localStorage.setItem(`soul_orders_${user.phone}`, JSON.stringify(updatedOrders));
                    }

                    // Clear cart if checking out the cart items
                    const isCartCheckout = checkoutItems.length === cart.length &&
                      checkoutItems.every((item, idx) => item.id === cart[idx].id && item.qty === cart[idx].qty);
                    if (isCartCheckout) {
                      setCart([]);
                    }

                    setCheckoutSuccess(true);
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
                >
                  {/* Contact section */}
                  <div className="neo-box" style={{
                    padding: '32px',
                    backgroundColor: '#fff',
                    borderRadius: '24px',
                    boxShadow: '8px 8px 0 #000',
                    border: 'var(--neo-border)',
                    textAlign: 'left'
                  }}>
                    <div style={{ display: 'flex', justifyContext: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                      <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
                        Contact
                      </h3>
                      <span
                        onClick={() => { playSound('click', isMuted); setShowLoginModal(true); }}
                        style={{ fontSize: '0.85rem', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'var(--font-tech)', marginLeft: 'auto' }}
                      >
                        Sign in
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <input
                        type="email"
                        placeholder="Email"
                        required
                        className="login-input"
                        value={checkoutForm.email}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                        style={{ width: '100%' }}
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'var(--font-tech)' }}>
                        <input type="checkbox" style={{ cursor: 'pointer', width: '16px', height: '16px', border: 'var(--neo-border-thin)', borderRadius: '4px' }} />
                        Email me with news and offers
                      </label>
                    </div>
                  </div>

                  {/* Delivery section */}
                  <div className="neo-box" style={{
                    padding: '32px',
                    backgroundColor: '#fff',
                    borderRadius: '24px',
                    boxShadow: '8px 8px 0 #000',
                    border: 'var(--neo-border)',
                    textAlign: 'left'
                  }}>
                    <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px' }}>
                      Delivery
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#4b5563', marginBottom: '6px', fontFamily: 'var(--font-tech)' }}>Country/Region</label>
                        <select className="login-input" style={{ width: '100%', padding: '12px 16px', fontSize: '0.95rem', fontWeight: 'bold' }}>
                          <option>India</option>
                        </select>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <input
                          type="text"
                          placeholder="First name (optional)"
                          className="login-input"
                          value={checkoutForm.firstName || ''}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, firstName: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Last name"
                          required
                          className="login-input"
                          value={checkoutForm.lastName || ''}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, lastName: e.target.value })}
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="Address"
                        required
                        className="login-input"
                        value={checkoutForm.address}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                        style={{ width: '100%' }}
                      />

                      <input
                        type="text"
                        placeholder="Apartment, suite, etc. (optional)"
                        className="login-input"
                        value={checkoutForm.apartment}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, apartment: e.target.value })}
                        style={{ width: '100%' }}
                      />

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <input
                          type="text"
                          placeholder="City"
                          required
                          className="login-input"
                          value={checkoutForm.city}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                        />
                        
                        <div style={{ position: 'relative' }}>
                          <select
                            className="login-input"
                            value={checkoutForm.state}
                            onChange={(e) => setCheckoutForm({ ...checkoutForm, state: e.target.value })}
                            style={{ width: '100%', appearance: 'none' }}
                          >
                            <option value="Delhi">Delhi</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                          </select>
                          <div style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)', pointerEvents: 'none', fontWeight: 'bold' }}>▼</div>
                        </div>

                        <input
                          type="text"
                          placeholder="PIN code"
                          required
                          className="login-input"
                          value={checkoutForm.pin}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, pin: e.target.value })}
                        />
                      </div>

                      <input
                        type="tel"
                        placeholder="Phone"
                        required
                        className="login-input"
                        value={checkoutForm.phone}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                        style={{ width: '100%' }}
                      />

                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'var(--font-tech)' }}>
                        <input type="checkbox" style={{ cursor: 'pointer', width: '16px', height: '16px', border: 'var(--neo-border-thin)', borderRadius: '4px' }} />
                        Save this information for next time
                      </label>
                    </div>
                  </div>

                  {/* Shipping method */}
                  <div className="neo-box" style={{
                    padding: '32px',
                    backgroundColor: '#fff',
                    borderRadius: '24px',
                    boxShadow: '8px 8px 0 #000',
                    border: 'var(--neo-border)',
                    textAlign: 'left'
                  }}>
                    <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px' }}>
                      Shipping method
                    </h3>
                    <div style={{
                      backgroundColor: 'var(--color-cream)',
                      border: 'var(--neo-border-thin)',
                      borderRadius: '12px',
                      padding: '16px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      color: '#4b5563',
                      fontFamily: 'var(--font-tech)'
                    }}>
                      {checkoutForm.address ? '⚡ Free Standard Delivery (3-5 business days)' : 'Enter your shipping address to view available shipping methods.'}
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="neo-box" style={{
                    padding: '32px',
                    backgroundColor: '#fff',
                    borderRadius: '24px',
                    boxShadow: '8px 8px 0 #000',
                    border: 'var(--neo-border)',
                    textAlign: 'left'
                  }}>
                    <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>
                      Payment
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '20px', fontWeight: 'bold', fontFamily: 'var(--font-tech)' }}>
                      All transactions are secure and encrypted.
                    </div>

                    {/* Razorpay secure block */}
                    <div className="neo-box" style={{
                      backgroundColor: 'var(--theme-card-bg)',
                      border: 'var(--neo-border-thin)',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        borderBottom: 'var(--neo-border-thin)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                          <input type="radio" checked readOnly style={{ width: '16px', height: '16px' }} />
                          <span>Razorpay Secure (UPI, Cards, Int\'l Cards, Wallets)</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', fontSize: '0.65rem', fontWeight: 'bold', backgroundColor: '#e5e7eb', padding: '4px 8px', borderRadius: '4px' }}>
                          UPI / VISA / MC / +17
                        </div>
                      </div>
                      <div style={{ padding: '24px 16px', fontSize: '0.9rem', color: 'var(--theme-text-light)', fontWeight: 'bold', lineHeight: 1.45 }}>
                        You\'ll be redirected to Razorpay Secure (UPI, Cards, Int\'l Cards, Wallets) to complete your purchase.
                      </div>
                    </div>

                    {/* Billing address */}
                    <div style={{ marginTop: '28px' }}>
                      <h4 style={{ fontFamily: 'var(--font-header)', fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px' }}>
                        Billing address
                      </h4>
                      <div className="neo-box" style={{
                        backgroundColor: '#fff',
                        border: 'var(--neo-border-thin)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <label style={{
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          borderBottom: 'var(--neo-border-thin)'
                        }}>
                          <input type="radio" name="billing" checked readOnly style={{ width: '16px', height: '16px' }} />
                          <span>Same as shipping address</span>
                        </label>
                        <label style={{
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}>
                          <input type="radio" name="billing" style={{ width: '16px', height: '16px' }} />
                          <span>Use a different billing address</span>
                        </label>
                      </div>
                    </div>

                    {/* Pay now button */}
                    <button
                      type="submit"
                      className="neo-btn"
                      style={{
                        width: '100%',
                        padding: '18px 0',
                        fontSize: '1.2rem',
                        fontWeight: 900,
                        justifyContent: 'center',
                        backgroundColor: '#22c55e',
                        color: '#000',
                        boxShadow: '4px 4px 0 #000',
                        marginTop: '32px'
                      }}
                    >
                      PAY NOW
                    </button>
                  </div>
                </form>

                {/* Right Column: Order Summary */}
                <div className="neo-box" style={{
                  padding: '32px',
                  backgroundColor: '#fff',
                  borderRadius: '24px',
                  boxShadow: '8px 8px 0 #000',
                  border: 'var(--neo-border)',
                  position: 'sticky',
                  top: '100px',
                  textAlign: 'left'
                }}>
                  <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '24px' }}>
                    Order Summary
                  </h3>

                  {/* Checkout Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    {checkoutItems.map((item, idx) => {
                      const basePrice = item.price * item.qty;
                      const discountedPrice = basePrice * (1 - appliedDiscount);
                      const discountAmount = basePrice * appliedDiscount;
                      return (
                        <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <div style={{ position: 'relative' }}>
                            <div className="neo-box" style={{
                              width: '64px',
                              height: '64px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              backgroundColor: '#f3f4f6',
                              border: 'var(--neo-border-thin)'
                            }}>
                              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <span style={{
                              position: 'absolute',
                              top: '-8px',
                              right: '-8px',
                              backgroundColor: '#000',
                              color: '#fff',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              border: '1.5px solid #fff'
                            }}>
                              {item.qty}
                            </span>
                          </div>

                          <div style={{ flexGrow: 1 }}>
                            <div style={{ fontWeight: 'black', fontSize: '0.95rem', fontFamily: 'var(--font-header)', textTransform: 'uppercase' }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 'bold' }}>{item.weight} - Standard Pack</div>
                            {appliedDiscount > 0 && (
                              <div style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: 'bold', marginTop: '2px' }}>
                                🏷 FLAT {(appliedDiscount * 100).toFixed(0)}% OFF (-₹{discountAmount.toFixed(2)})
                              </div>
                            )}
                          </div>

                          <div style={{ textAlign: 'right', fontWeight: 'bold', fontFamily: 'var(--font-tech)' }}>
                            {appliedDiscount > 0 ? (
                              <>
                                <span style={{ textDecoration: 'line-through', color: '#9ca3af', marginRight: '6px', fontSize: '0.85rem' }}>₹{basePrice.toFixed(2)}</span>
                                <span style={{ color: '#000' }}>₹{discountedPrice.toFixed(2)}</span>
                              </>
                            ) : (
                              <span>₹{basePrice.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Discount input */}
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                    <input
                      type="text"
                      placeholder="Discount code"
                      className="login-input"
                      value={discountCode}
                      onChange={(e) => { setDiscountCode(e.target.value); setDiscountError(''); }}
                      style={{ flexGrow: 1, textTransform: 'uppercase' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click', isMuted);
                        const codeUpper = discountCode.trim().toUpperCase();
                        if (codeUpper === 'SOULFRFR' || codeUpper === 'CHEESYDRIP' || codeUpper === 'SWEETHEAT' || codeUpper === 'SALTYVIBES') {
                          setAppliedDiscount(0.25);
                          setDiscountError('');
                        } else if (codeUpper === '') {
                          setDiscountError('Enter code first');
                        } else {
                          setDiscountError('Invalid coupon code');
                        }
                      }}
                      className="neo-btn"
                      style={{ padding: '0 18px', fontSize: '0.85rem', boxShadow: '2px 2px 0 #000' }}
                    >
                      Apply
                    </button>
                  </div>
                  {discountError && (
                    <div style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: 'bold', marginTop: '-16px', marginBottom: '16px', fontFamily: 'var(--font-tech)' }}>
                      ❌ {discountError}
                    </div>
                  )}

                  {/* Calculations */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '20px',
                    fontSize: '0.95rem',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-tech)'
                  }}>
                    {(() => {
                      const baseSubtotal = checkoutItems.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
                      const finalSubtotal = baseSubtotal * (1 - appliedDiscount);
                      const shippingCost = finalSubtotal >= 500 ? 0 : 40;
                      const finalTotal = finalSubtotal + shippingCost;
                      const totalSavings = baseSubtotal * appliedDiscount;

                      return (
                        <>
                          <div style={{ display: 'flex', justifyContext: 'space-between' }}>
                            <span style={{ color: '#4b5563' }}>Subtotal</span>
                            <span>₹{finalSubtotal.toFixed(2)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContext: 'space-between' }}>
                            <span style={{ color: '#4b5563' }}>Shipping</span>
                            <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
                          </div>
                          
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            borderTop: 'var(--neo-border-thin)',
                            paddingTop: '16px',
                            marginTop: '8px',
                            fontSize: '1.25rem',
                            fontWeight: 900
                          }}>
                            <span>Total</span>
                            <span>INR ₹{finalTotal.toFixed(2)}</span>
                          </div>

                          {totalSavings > 0 && (
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              color: '#22c55e',
                              fontSize: '0.9rem',
                              marginTop: '8px'
                            }}>
                              <span>TOTAL SAVINGS</span>
                              <span>₹{totalSavings.toFixed(2)}</span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Policies links list in order summary footer */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '24px',
                    marginTop: '32px',
                    color: '#6b7280'
                  }}>
                    {[
                      { label: 'Refund policy', key: 'refund' },
                      { label: 'Shipping', key: 'terms' },
                      { label: 'Privacy policy', key: 'privacy' },
                      { label: 'Terms of service', key: 'terms' },
                      { label: 'Contact', key: 'customized' }
                    ].map((link, idx) => (
                      <span
                        key={idx}
                        onClick={() => {
                          playSound('click', isMuted);
                          if (link.key === 'customized') {
                            setCurrentPage('customized');
                          } else {
                            setActivePolicy(link.key);
                          }
                        }}
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {link.label}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* WISHLIST PAGE */}
      {currentPage === 'wishlist' && (
        <section className="wishlist-page-section" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Y2K Grid Background */}
          <div className="y2k-grid" style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none' }}></div>
          
          {/* Cyber stickers in background */}
          <div className="y2k-shape shape-circle" style={{ position: 'absolute', top: '12%', left: '4%', width: '130px', height: '130px', backgroundColor: 'rgba(163, 230, 53, 0.1)', border: '2px dashed rgba(0,0,0,0.15)', borderRadius: '50%', zIndex: 0, transform: 'rotate(-15deg)', display: 'flex', alignItems: 'center', justifyCentert: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-tech)', fontWeight: 900, color: 'rgba(0,0,0,0.3)', letterSpacing: '1px' }}>SYSTEM STORAGE</span>
          </div>
          <div className="y2k-shape animate-float" style={{ position: 'absolute', bottom: '15%', right: '3%', width: '180px', height: '180px', backgroundColor: 'rgba(255, 123, 0, 0.06)', border: '2px solid rgba(0,0,0,0.1)', borderRadius: '43% 57% 41% 59% / 57% 45% 55% 43%', zIndex: 0, pointerEvents: 'none' }}></div>
          <div className="y2k-shape" style={{ position: 'absolute', top: '35%', right: '8%', zIndex: 0, opacity: 0.15, fontSize: '3.5rem', color: '#ff0055', userSelect: 'none', pointerEvents: 'none' }}>✦</div>
          <div className="y2k-shape animate-spin" style={{ position: 'absolute', bottom: '8%', left: '6%', zIndex: 0, opacity: 0.1, fontSize: '4.5rem', color: '#06b6d4', animationDuration: '25s', userSelect: 'none', pointerEvents: 'none' }}>✿</div>

          <div className="site-wrapper" style={{ position: 'relative', zIndex: 1 }}>
            {/* Back Nav */}
            <button
              className="wishlist-back-btn"
              onClick={() => { setCurrentPage('home'); window.scrollTo(0, 0); }}
            >
              <ArrowLeft size={18} /> BACK TO HOME
            </button>

            {/* Page Title */}
            <div className="wishlist-page-header">
              <div className="wishlist-page-title-row" style={{ position: 'relative' }}>
                <span className="wishlist-page-eyebrow">✦ SECURED STORAGE // GEN-Z VAULT ✦</span>
                <h1 className="wishlist-page-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  MY WISHLIST
                  <span className="wishlist-title-badge animate-bounce">S-TIER</span>
                </h1>
                <p className="wishlist-page-subtitle">All the fire you've bookmarked — don't sleep on 'em 🔥</p>
              </div>
              <div className="wishlist-count-badge">
                <Heart size={20} fill="#ff0055" color="#ff0055" />
                <span>{wishlist.length} ITEM{wishlist.length !== 1 ? 'S' : ''}</span>
              </div>
            </div>

            {/* Empty State */}
            {wishlist.length === 0 ? (
              <div className="wishlist-empty-state">
                <div className="wishlist-empty-icon">💔</div>
                <h2 className="wishlist-empty-title">bestie, your wishlist is dry rn</h2>
                <p className="wishlist-empty-sub">no cap, you haven't saved a single snack yet. that's lowkey a red flag 🚩</p>
                <p className="wishlist-empty-sub2">tap the 🤍 on any product to add it here before it sells out fr fr</p>
                <button
                  className="wishlist-empty-cta"
                  onClick={() => { setCurrentPage('catalog'); window.scrollTo(0, 0); }}
                >
                  <Sparkles size={16} /> SHOP THE DRIP
                </button>
              </div>
            ) : (
              <>
                {/* Wishlist Grid */}
                <div className="wishlist-items-grid">
                  {wishlist.map(item => (
                    <div key={item.id} className="wishlist-card">
                      {/* Product Image */}
                      <div className="wishlist-card-img-wrap">
                        {/* Custom Card Ribbon Badge */}
                        <div className="wishlist-card-tag-pill" style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          backgroundColor: item.price > 170 ? '#ff0055' : 'var(--theme-accent, #a3e635)',
                          color: '#000',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.62rem',
                          fontFamily: 'var(--font-tech)',
                          fontWeight: 900,
                          border: 'var(--neo-border-thin)',
                          boxShadow: '1.5px 1.5px 0 #000',
                          zIndex: 3,
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          {item.price > 170 ? '★ PREMIUM' : '✦ COP'}
                        </div>

                        {item.image && (
                          <img src={item.image} alt={item.name} className="wishlist-card-img" />
                        )}
                        {!item.image && (
                          <div className="wishlist-card-img-placeholder">
                            <Sparkles size={32} color="#ff0055" />
                          </div>
                        )}
                        {/* Remove button */}
                        <button
                          className="wishlist-remove-btn"
                          onClick={() => toggleWishlist(item)}
                          title="Remove from wishlist"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="wishlist-card-info">
                        <span className="wishlist-card-tag">SOUL FUEL LITE</span>
                        <h3 className="wishlist-card-name">{item.name.replace('Roasted Makhana - ', '')}</h3>
                        <div className="wishlist-card-price-row">
                          <span className="wishlist-card-price-badge">₹{item.price}</span>
                          {item.originalPrice && (
                            <span className="wishlist-card-og-price">₹{item.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="wishlist-card-actions">
                        <button
                          className="wishlist-add-btn"
                          onClick={(e) => { addToCart(item, e); }}
                        >
                          <ShoppingCart size={15} /> ADD TO BAG
                        </button>
                        <button
                          className="wishlist-heart-btn"
                          onClick={() => toggleWishlist(item)}
                        >
                          <Trash2 size={15} /> REMOVE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom CTA */}
                <div className="wishlist-bottom-cta animate-float">
                  <p className="wishlist-bottom-text">everything slaps, add it all to bag and secure the bag 💅</p>
                  <button
                    className="wishlist-add-all-btn"
                    onClick={(e) => { wishlist.forEach(item => addToCart(item, e)); }}
                  >
                    <ShoppingCart size={16} /> ADD ALL TO BAG ({wishlist.length})
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {currentPage === 'customized' && (
        <section className="customized-page-section" style={{
          minHeight: '100vh',
          padding: '80px 0 140px',
          backgroundColor: 'var(--color-cream, #fef9f0)',
          borderBottom: '4px solid #000',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.05) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}>
          <div className="site-wrapper" style={{ maxWidth: '800px' }}>
            {/* Back Button */}
            <button
              className="wishlist-back-btn"
              onClick={() => { playSound('click', isMuted); setCurrentPage('home'); window.scrollTo(0, 0); }}
            >
              <ArrowLeft size={16} /> BACK TO BASE
            </button>

            {/* Bulk Orders Notice Board */}
            <div className="neo-box animate-float" style={{
              backgroundColor: 'var(--theme-accent, #a3e635)',
              border: 'var(--neo-border)',
              borderRadius: '24px',
              padding: '24px',
              marginBottom: '36px',
              boxShadow: '6px 6px 0px #000',
              textAlign: 'center'
            }}>
              <span style={{
                fontFamily: 'var(--font-tech)',
                fontWeight: 900,
                fontSize: '0.85rem',
                letterSpacing: '2px',
                color: '#ff0055',
                display: 'block',
                marginBottom: '8px'
              }}>🧪 CUSTOMIZATION INFO 🧪</span>
              <h2 style={{
                fontFamily: 'var(--font-header)',
                fontSize: '1.8rem',
                fontWeight: 900,
                color: '#000',
                textTransform: 'uppercase',
                lineHeight: 1.1,
                marginBottom: '12px'
              }}>BULK ORDERS ONLY (MINIMUM 50+ PACKS)</h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#1f2937',
                lineHeight: 1.4,
                margin: 0
              }}>
                Please note: We only customize packaging designs and recipe formulations for bulk orders of 50+ packs (ideal for corporate events, birthday parties, weddings, or gym branding). Fill out the transmission log below and our team will connect with you!
              </p>
            </div>

            {/* The Connect Here Form Container */}
            {bulkSuccess ? (
              <div className="neo-box" style={{
                backgroundColor: 'var(--theme-card-bg)',
                border: 'var(--neo-border)',
                borderRadius: '24px',
                padding: '50px 30px',
                boxShadow: '8px 8px 0px var(--theme-shadow-color)',
                color: 'var(--theme-text)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🚀</div>
                <h3 style={{
                  fontFamily: 'var(--font-header)',
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: 'var(--theme-text)',
                  textTransform: 'uppercase',
                  marginBottom: '16px'
                }}>Transmission Sent!</h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--theme-text-light)',
                  maxWidth: '500px',
                  margin: '0 auto 32px auto',
                  lineHeight: 1.4
                }}>
                  Bestie, your custom request has successfully reached our snack lab. Our flavor engineers are on it and will connect with you within 24 hours!
                </p>
                <button
                  className="neo-btn"
                  onClick={() => { playSound('laser', isMuted); setBulkSuccess(false); setBulkForm({ occasion: 'occasions', name: '', email: '', message: '' }); }}
                  style={{ boxShadow: '4px 4px 0 #000' }}
                >
                  SEND ANOTHER REQUEST
                </button>
              </div>
            ) : (
              <div className="neo-box" style={{
                backgroundColor: 'var(--theme-card-bg)',
                border: 'var(--neo-border)',
                borderRadius: '24px',
                padding: '40px 32px',
                boxShadow: '8px 8px 0px var(--theme-shadow-color)',
                color: 'var(--theme-text)',
                textAlign: 'center'
              }}>
                <h1 style={{
                  fontFamily: 'var(--font-header)',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 900,
                  color: 'var(--theme-text)',
                  letterSpacing: '1px',
                  lineHeight: 1,
                  marginBottom: '32px',
                  textTransform: 'uppercase'
                }}>
                  connect here
                </h1>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!bulkForm.name || !bulkForm.email || !bulkForm.message || bulkForm.occasion === 'occasions') {
                    playSound('crunch', isMuted);
                    return;
                  }
                  playSound('laser', isMuted);
                  triggerConfetti();
                  setBulkSuccess(true);
                }} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  maxWidth: '500px',
                  margin: '0 auto'
                }}>
                  {/* Occasions Dropdown */}
                  <div style={{ position: 'relative', width: '100%' }}>
                    <select
                      value={bulkForm.occasion}
                      onChange={(e) => setBulkForm({ ...bulkForm, occasion: e.target.value })}
                      className="login-input"
                      style={{
                        width: '100%',
                        padding: '16px',
                        fontSize: '1rem',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 'bold',
                        color: '#000',
                        backgroundColor: '#fff',
                        border: 'var(--neo-border-thin)',
                        borderRadius: '12px',
                        appearance: 'none',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="occasions">Select Occasion</option>
                      <option value="wedding">Wedding 💒</option>
                      <option value="birthday">Birthday Party 🎂</option>
                      <option value="corporate">Corporate Event 💼</option>
                      <option value="promotion">Gym / Club Branding 💪</option>
                      <option value="other">Other Events ⚡</option>
                    </select>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      right: '18px',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#000',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}>
                      ▼
                    </div>
                  </div>

                  {/* Name Input */}
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={bulkForm.name}
                    onChange={(e) => setBulkForm({ ...bulkForm, name: e.target.value })}
                    required
                    className="login-input"
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-body)',
                      color: '#000',
                      backgroundColor: '#fff',
                      border: 'var(--neo-border-thin)',
                      borderRadius: '12px',
                      outline: 'none'
                    }}
                  />

                  {/* Email Input */}
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={bulkForm.email}
                    onChange={(e) => setBulkForm({ ...bulkForm, email: e.target.value })}
                    required
                    className="login-input"
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-body)',
                      color: '#000',
                      backgroundColor: '#fff',
                      border: 'var(--neo-border-thin)',
                      borderRadius: '12px',
                      outline: 'none'
                    }}
                  />

                  {/* Message Input */}
                  <textarea
                    placeholder="Your Message"
                    rows="6"
                    value={bulkForm.message}
                    onChange={(e) => setBulkForm({ ...bulkForm, message: e.target.value })}
                    required
                    className="login-input"
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-body)',
                      color: '#000',
                      backgroundColor: '#fff',
                      border: 'var(--neo-border-thin)',
                      borderRadius: '12px',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  ></textarea>

                  {/* Send Button */}
                  <button
                    type="submit"
                    className="neo-btn"
                    style={{
                      width: '100%',
                      padding: '18px',
                      fontSize: '1.2rem',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 900,
                      justifyContent: 'center',
                      boxShadow: '4px 4px 0px #000',
                      marginTop: '10px'
                    }}
                  >
                    Send Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
      )}

      {currentPage === 'home' && (
        <>


          {/* 6. INSTAGRAM SOCIAL FEED SECTION */}
          <section style={{
        padding: '80px 0',
        backgroundColor: '#0c0a09',
        color: '#fff',
        borderBottom: 'var(--neo-border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Y2K grid background overlay for rich texture */}
        <div className="y2k-grid" style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}></div>
        
        <div className="site-wrapper" style={{ position: 'relative', zIndex: 2 }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div className="neo-box" style={{
              padding: '6px 14px',
              fontFamily: 'var(--font-tech)',
              fontSize: '0.8rem',
              fontWeight: 800,
              backgroundColor: 'var(--theme-accent)',
              color: '#000',
              boxShadow: '3px 3px 0 var(--theme-secondary)',
              marginBottom: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textTransform: 'uppercase'
            }}>
              <Instagram size={14} className="animate-spin" />
              <span>Aesthetic Feed Check</span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-header)',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#fff',
              marginBottom: '18px',
              textTransform: 'uppercase',
              letterSpacing: '0.02em'
            }}>
              <span style={{ color: 'var(--theme-accent)' }}>@soul_fuel_lite</span> on IG <br />
              hits different
            </h2>
          </div>

          {/* Horizontal Grid Gallery */}
          <div className="insta-posts-grid-horizontal">
            {instaFeed.slice(0, 5).map(post => (
              <a 
                key={post.id}
                href={post.permalink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="insta-feed-card"
              >
                <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden' }}>
                  {post.media_type === 'VIDEO' ? (
                    <video
                      src={post.video_url}
                      poster={post.media_url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="insta-img"
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        display: 'block'
                      }}
                    />
                  ) : (
                    <img 
                      src={post.media_url} 
                      alt={post.caption} 
                      className="insta-img"
                    />
                  )}
                  {post.media_type === 'VIDEO' && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      padding: '6px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 3
                    }}>
                      <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                        <path d="M23 7l-7 5 7 5V7z" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                    </div>
                  )}
                  {post.pinned && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      letterSpacing: '1px'
                    }}>
                      📌 PINNED
                    </div>
                  )}
                </div>
                <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--theme-accent)', display: 'block', marginBottom: '4px' }}>@soul_fuel_lite</span>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#e4e4e7', fontWeight: 500, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.caption}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px', fontSize: '0.7rem', color: 'var(--theme-accent)', fontWeight: 800 }}>
                    <span>VIBE CHECK ↗</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Bottom Call to Action */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <a 
              href="https://www.instagram.com/soul_fuel_lite/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="neo-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                fontSize: '1rem',
                backgroundColor: 'var(--theme-secondary)',
                color: '#fff',
                textDecoration: 'none',
                boxShadow: '4px 4px 0 #000'
              }}
            >
              <Instagram size={20} />
              FOLLOW @SOUL_FUEL_LITE ON IG
            </a>
          </div>

        </div>
      </section>

      {/* 5. DYNAMIC CAROUSEL SECTION (NEO-BRUTALIST & PSYCHEDELIC LIFESTYLE CONSOLE) */}
      <section id="lore-section" style={{
        padding: '100px 0',
        background: 'var(--theme-bg)',
        borderBottom: 'var(--neo-border)',
        position: 'relative'
      }}>
        {/* Background pop design details */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.05,
          backgroundImage: 'radial-gradient(#000 20%, transparent 20%)',
          backgroundSize: '15px 15px',
          pointerEvents: 'none'
        }}></div>

        <div className="site-wrapper" style={{ position: 'relative', zIndex: 1 }}>

          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{
              fontFamily: 'var(--font-tech)',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: '#000',
              backgroundColor: '#fff',
              border: 'var(--neo-border-thin)',
              padding: '4px 12px',
              boxShadow: '2px 2px 0 #000',
              display: 'inline-block',
              marginBottom: '12px'
            }}>OUR ORGANIC NATURE STORY</span>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              fontFamily: 'var(--font-header)',
              textShadow: '3px 3px 0px #fff'
            }}>Mithila Seeds to Popped Souls</h2>
          </div>

          {/* Interactive Carousel Console wrapper */}
          <div className="neo-box" style={{
            maxWidth: '960px',
            margin: '0 auto',
            borderRadius: '24px',
            backgroundColor: '#fff',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            boxShadow: '10px 10px 0px 0px #000'
          }}>
            {/* Carousel Column 1: Image container with cyber indicators */}
            <div style={{
              position: 'relative',
              height: '420px',
              borderRight: 'var(--neo-border)',
              backgroundColor: '#000',
              overflow: 'hidden'
            }}>
              {carouselSlides.map((slide, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: carouselIndex === idx ? 1 : 0,
                    transform: `translateX(${(idx - carouselIndex) * 20}px)`,
                    transition: 'opacity 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    pointerEvents: carouselIndex === idx ? 'all' : 'none'
                  }}
                >
                  <img
                    src={slide.img}
                    alt={slide.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'contrast(1.1) brightness(0.95)'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)`
                  }}></div>
                </div>
              ))}

              {/* Digital Y2K Overlay Indicator */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                backgroundColor: 'rgba(0,0,0,0.85)',
                color: '#06b6d4',
                fontFamily: 'var(--font-tech)',
                fontSize: '0.75rem',
                padding: '6px 12px',
                border: '1px solid #06b6d4',
                boxShadow: '0 0 10px rgba(6,182,212,0.4)',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span className="animate-pulse" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06b6d4' }}></span>
                LIVE FEED: HARVEST_CAM_0{carouselIndex + 1}
              </div>
            </div>

            {/* Carousel Column 2: Text Description & Controls */}
            <div style={{
              padding: '40px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: 'var(--theme-card-bg)'
            }}>
              <div>
                {/* Tech tag */}
                <span style={{
                  fontFamily: 'var(--font-tech)',
                  fontWeight: 900,
                  fontSize: '0.75rem',
                  letterSpacing: '1.5px',
                  color: 'var(--theme-accent-dark)',
                  display: 'block',
                  marginBottom: '12px'
                }}>
                  {carouselSlides[carouselIndex].tagline}
                </span>

                {/* Animated Slide Header */}
                <h3 style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: '#000',
                  marginBottom: '16px',
                  lineHeight: 1.1,
                  fontFamily: 'var(--font-header)'
                }}>
                  {carouselSlides[carouselIndex].title}
                </h3>

                {/* Animated Description */}
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.45,
                  color: 'var(--theme-text-light)',
                  fontFamily: 'var(--font-body)'
                }}>
                  {carouselSlides[carouselIndex].desc}
                </p>
              </div>

              {/* Console Dashboard Controls */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: 'var(--neo-border-thin)',
                paddingTop: '24px',
                marginTop: '32px'
              }}>
                {/* Dynamic Page indicator dot markers */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {carouselSlides.map((_, idx) => (
                    <span
                      key={idx}
                      onClick={() => {
                        playSound('click', isMuted);
                        setCarouselIndex(idx);
                      }}
                      style={{
                        display: 'block',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        border: 'var(--neo-border-thin)',
                        backgroundColor: carouselIndex === idx ? 'var(--theme-accent)' : '#fff',
                        cursor: 'pointer'
                      }}
                    ></span>
                  ))}
                </div>

                {/* Brutalist Console Nav Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      playSound('click', isMuted);
                      setCarouselIndex((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
                    }}
                    onMouseEnter={() => playSound('hover', isMuted)}
                    className="neo-box-interactive"
                    style={{
                      width: '42px',
                      height: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#fff',
                      border: 'var(--neo-border-thin)',
                      boxShadow: '2px 2px 0 #000',
                      cursor: 'pointer'
                    }}
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    onClick={() => {
                      playSound('click', isMuted);
                      setCarouselIndex((prev) => (prev + 1) % carouselSlides.length);
                    }}
                    onMouseEnter={() => playSound('hover', isMuted)}
                    className="neo-box-interactive"
                    style={{
                      width: '42px',
                      height: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#fff',
                      border: 'var(--neo-border-thin)',
                      boxShadow: '2px 2px 0 #000',
                      cursor: 'pointer'
                    }}
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* AVAILABLE ON MARQUEE SECTION */}
      <section style={{
        backgroundColor: '#000',
        padding: '120px 0 60px 0',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: 'var(--neo-border)'
      }}>
        <style>{`
          @keyframes domestic-marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-33.3333%, 0, 0); }
          }
        `}</style>

        <div className="site-wrapper" style={{ position: 'relative', zIndex: 3 }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{
              fontFamily: 'var(--font-header)',
              fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              margin: 0
            }}>
              AVAILABLE ON - DOMESTIC
            </h2>
          </div>

          {/* Marquee horizontal scroller */}
          <div className="domestic-marquee-container" style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            width: '100%',
            padding: '20px 0',
            position: 'relative'
          }}>
            <div className="domestic-marquee-content" style={{
              display: 'inline-flex',
              alignItems: 'center',
              animation: 'domestic-marquee 15s linear infinite',
              gap: '60px'
            }}>
              {Array(6).fill([
                { name: 'blinkit', color: '#ffc72c' },
                { name: 'zepto', color: '#a855f7' },
                { name: 'xyz', color: '#06b6d4' }
              ]).flat().map((item, idx) => (
                <span key={idx} style={{
                  fontFamily: 'var(--font-header)',
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  fontWeight: 900,
                  textTransform: 'lowercase',
                  color: '#fff',
                  letterSpacing: '2px',
                  display: 'inline-block',
                  transition: 'color 0.2s ease, text-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  playSound('hover', isMuted);
                  e.currentTarget.style.color = item.color;
                  e.currentTarget.style.textShadow = `0 0 15px ${item.color}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.textShadow = 'none';
                }}
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

        </>
      )}

      {/* 8. SHOPPING CART SIDEBAR MODAL (EXPERIMENTAL BRUTALIST BASKET) */}
      {isCartOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 200,
          display: 'flex',
          justifyContent: 'flex-end'
        }}
          onClick={() => setIsCartOpen(false)}
        >
          {/* Basket Console Container */}
          <div
            className="neo-box"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '460px',
              height: '100%',
              backgroundColor: '#fff',
              borderWidth: '0 0 0 var(--border-width)',
              borderRadius: 0,
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
              padding: '30px'
            }}
          >
            {/* Basket Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: 'var(--neo-border)',
              paddingBottom: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingCart size={24} />
                <h2 style={{ fontFamily: 'var(--font-header)', fontSize: '1.6rem', fontWeight: 900, color: '#000' }}>YOUR SOUL BASKET</h2>
              </div>
              <button
                onClick={() => { playSound('click', isMuted); setIsCartOpen(false); }}
                onMouseEnter={() => playSound('hover', isMuted)}
                className="neo-box-interactive"
                style={{
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                  border: 'var(--neo-border-thin)',
                  boxShadow: '2px 2px 0 #000',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Basket Items List */}
            <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}
              className="custom-scrollbar">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <Smile size={48} className="animate-bounce" style={{ color: 'var(--theme-accent)', margin: '0 auto 16px auto' }} />
                  <p style={{ fontWeight: 'bold', fontSize: '1.1rem', fontFamily: 'var(--font-body)' }}>Your bag is giving empty behavior 💀</p>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '6px' }}>Add some premium roasted makhana to unlock S-Tier vibes.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="neo-box" style={{
                    padding: '12px',
                    borderRadius: '12px',
                    display: 'flex',
                    gap: '12px',
                    backgroundColor: 'var(--theme-card-bg)',
                    border: 'var(--neo-border-thin)',
                    boxShadow: '3px 3px 0 #000'
                  }}>
                    <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', border: 'var(--neo-border-thin)', borderRadius: '8px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1, textAlign: 'left' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 900, fontFamily: 'var(--font-header)', color: '#000' }}>{item.name}</h4>
                        <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 'bold' }}>₹{item.price} each</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        {/* Qty increment console */}
                        <div style={{ display: 'flex', alignItems: 'center', border: 'var(--neo-border-thin)', borderRadius: '6px', overflow: 'hidden' }}>
                          <button onClick={() => updateCartQty(item.id, -1)} style={{ padding: '2px 8px', border: 'none', background: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                          <span style={{ padding: '2px 10px', background: '#000', color: '#fff', fontWeight: 'bold', fontSize: '0.8rem' }}>{item.qty}</span>
                          <button onClick={() => updateCartQty(item.id, 1)} style={{ padding: '2px 8px', border: 'none', background: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                        </div>

                        {/* Trash */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Basket Checkout Block */}
            {cart.length > 0 && (
              <div style={{ borderTop: 'var(--neo-border)', paddingTop: '20px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.25rem', marginBottom: '20px' }}>
                  <span>TOTAL ESTIMATED:</span>
                  <span style={{ color: 'var(--theme-accent-dark)' }}>₹{totalPrice}</span>
                </div>

                <button
                  className="neo-btn"
                  onClick={() => {
                    playSound('crunch', isMuted);
                    setCheckoutItems([...cart]);
                    setCheckoutSuccess(false);
                    setAppliedDiscount(0);
                    setDiscountCode('');
                    setDiscountError('');
                    setCurrentPage('checkout');
                    setIsCartOpen(false);
                    window.scrollTo(0, 0);
                  }}
                  onMouseEnter={() => playSound('hover', isMuted)}
                  style={{ width: '100%', justifyContent: 'center', padding: '16px 0', fontSize: '1rem' }}
                >
                  BUY IT NOW ✦
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. AESTHETICS BRAND FOOTER (BRUTALIST & POP ART MIX) */}
      <footer style={{
        backgroundColor: '#000',
        color: '#fff',
        padding: '80px 0 40px 0',
        borderTop: 'var(--neo-border)',
        position: 'relative',
        zIndex: 5
      }}>
        <div className="site-wrapper">

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            textAlign: 'left',
            marginBottom: '60px'
          }}>

            {/* Footer Col 1: Bio */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', cursor: 'pointer' }}
                onClick={() => {
                  playSound('click', isMuted);
                  setCurrentPage('home');
                  window.scrollTo(0, 0);
                }}>
                <img src={logoSoulFuel} alt="Soul Fuel Logo" style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid #fff' }} />
                <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--theme-accent)' }}>SOUL FUEL LITE</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.45, fontFamily: 'var(--font-body)', marginBottom: '16px' }}>
                Healthy snacking brand **Soul Fuel Lite** presents its premium air-popped makhana product line under **Fox & Lotus**, air-baked in pristine wetlands.
              </p>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-tech)' }}>
                CODENAME: SNACK_SYS_ACTIVE
              </span>
            </div>


            {/* Footer Col 3: Policies and Legal */}
            <div>
              <h4 style={{ fontFamily: 'var(--font-header)', fontSize: '0.95rem', fontWeight: 900, letterSpacing: '1px', marginBottom: '20px', color: '#fff' }}>LEGAL PORTAL</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>
                <li>
                  <button 
                    onClick={() => { playSound('click', isMuted); setActivePolicy('privacy'); }} 
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', font: 'inherit', padding: 0, textAlign: 'left' }}
                    onMouseEnter={() => playSound('hover', isMuted)}
                  >
                    Privacy Policy ↗
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { playSound('click', isMuted); setActivePolicy('terms'); }} 
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', font: 'inherit', padding: 0, textAlign: 'left' }}
                    onMouseEnter={() => playSound('hover', isMuted)}
                  >
                    Terms & Conditions ↗
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { playSound('click', isMuted); setActivePolicy('refund'); }} 
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', font: 'inherit', padding: 0, textAlign: 'left' }}
                    onMouseEnter={() => playSound('hover', isMuted)}
                  >
                    Return & Refund ↗
                  </button>
                </li>
              </ul>
            </div>

            {/* Footer Col 3: Support & Consent */}
            <div>
              <h4 style={{ fontFamily: 'var(--font-header)', fontSize: '0.95rem', fontWeight: 900, letterSpacing: '1px', marginBottom: '20px', color: '#fff' }}>CONSENT & SUPPORT</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.45, fontFamily: 'var(--font-body)', marginBottom: '20px' }}>
                Have questions, concerns, or feedback about Soul Fuel Lite or Fox & Lotus snacks? Reach out directly to our helpdesk:
              </p>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-tech)', color: '#94a3b8' }}>
                <span style={{ display: 'block', marginBottom: '6px', letterSpacing: '0.5px', color: '#fff', fontWeight: 'bold' }}>CONSENT OR INCONVENIENCE?</span>
                <a 
                  href="mailto:dhamitanuja78@gmail.com" 
                  style={{ 
                    color: 'var(--theme-accent)', 
                    textDecoration: 'none', 
                    fontWeight: 'bold', 
                    fontSize: '0.95rem',
                    borderBottom: '1px dashed var(--theme-accent)',
                    paddingBottom: '2px',
                    display: 'inline-block'
                  }} 
                  onMouseEnter={() => playSound('hover', isMuted)}
                >
                  dhamitanuja78@gmail.com ↗
                </a>
              </div>
            </div>

          </div>

          {/* Footer Bottom copyright and parent logo */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '30px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#4b5563', fontFamily: 'var(--font-body)' }}>
              © 2026 FOX & LOTUS INVENTIONS. ALL CODES SECURED. SNACK WISELY.
            </span>

            {/* Logo display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.7rem', color: '#4b5563', fontWeight: 'bold', fontFamily: 'var(--font-tech)' }}>POWERED BY</span>
              <div style={{
                height: '32px',
                border: '1px solid #444',
                backgroundColor: '#000',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '1px 1px 0 #fff'
              }}>
                <img src={logoFoxLotus} alt="Fox and Lotus Logo" style={{ height: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 8.5. LOGIN MODAL OVERLAY */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => {
          setShowLoginModal(false);
          setOtpSent(false);
          setOtpDigits(['', '', '', '']);
          setSmsToast({ visible: false, message: '', code: '' });
        }}>
          <div className="login-console-box" onClick={(e) => e.stopPropagation()}>
            <div className="login-header">
              <span className="login-title" style={{ fontFamily: 'var(--font-header)', fontWeight: 900, color: '#000' }}>
                {otpSent ? '🔐 ENTER ACCESS CODE' : '🔑 IDENTITY PORTAL'}
              </span>
              <button
                onClick={() => {
                  playSound('click', isMuted);
                  setShowLoginModal(false);
                  setOtpSent(false);
                  setOtpDigits(['', '', '', '']);
                  setSmsToast({ visible: false, message: '', code: '' });
                }}
                onMouseEnter={() => playSound('hover', isMuted)}
                className="neo-box-interactive"
                style={{
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                  border: 'var(--neo-border-thin)',
                  boxShadow: '2px 2px 0 #000',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {!otpSent ? (
              <form onSubmit={handleRequestOtp}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 'bold', color: '#4b5563' }}>
                  Secure your session to claim the crunch. Guest status lacks main character energy. 🔐
                </p>
                <div className="login-input-group">
                  <div className="login-field">
                    <label className="login-label">PLAYER NAME / TAG</label>
                    <input
                      type="text"
                      className="login-input"
                      placeholder="e.g. SnackLord99"
                      required
                      value={loginForm.name}
                      onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                    />
                  </div>
                  <div className="login-field">
                    <label className="login-label">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      className="login-input"
                      placeholder="e.g. name@domain.com"
                      required
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    />
                  </div>
                  <div className="login-field">
                    <label className="login-label">COMMUNICATION FREQUENCY (PHONE)</label>
                    <input
                      type="tel"
                      pattern="[0-9]{10}"
                      className="login-input"
                      placeholder="10-digit mobile number"
                      required
                      value={loginForm.phone}
                      onChange={handlePhoneChange}
                    />
                  </div>
                  <div className="login-field">
                    <label className="login-label">SHIPPING COORDINATES (ADDRESS)</label>
                    <input
                      type="text"
                      className="login-input"
                      placeholder="Enter street, city, coordinates"
                      required
                      value={loginForm.address}
                      onChange={(e) => setLoginForm({ ...loginForm, address: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="neo-btn"
                  onMouseEnter={() => playSound('hover', isMuted)}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: '0.95rem' }}
                >
                  REQUEST ACCESS CODE ✦
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 'bold', color: '#4b5563' }}>
                  An access code was transmitted to your visual interface. Enter the 4-digit code:
                </p>
                
                <div className="otp-box-container">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-digit-${idx}`}
                      type="text"
                      maxLength="1"
                      className="otp-digit-input"
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(e.target.value, idx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
                          const prevInput = document.getElementById(`otp-digit-${idx - 1}`);
                          if (prevInput) prevInput.focus();
                        }
                      }}
                      required
                    />
                  ))}
                </div>

                {loginError && (
                  <div style={{
                    color: '#ef4444',
                    backgroundColor: 'rgba(239,68,68,0.1)',
                    border: '1px solid #ef4444',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-tech)',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="neo-btn"
                  onMouseEnter={() => playSound('hover', isMuted)}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: '0.95rem', marginBottom: '12px' }}
                >
                  VERIFY SYSTEM IDENTITY ✦
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSound('click', isMuted);
                    setOtpSent(false);
                    setOtpDigits(['', '', '', '']);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'center',
                    textDecoration: 'underline'
                  }}
                >
                  Go Back to Identity Panel
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PROFILE SIDEBAR MODAL */}
      {showProfileModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 200,
          display: 'flex',
          justifyContent: 'flex-end'
        }}
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="profile-sidebar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Profile Header */}
            <div className="profile-avatar-row">
              <div className="profile-avatar-circle">👤</div>
              <div className="profile-player-info">
                <span className="profile-player-tag">VERIFIED CRUNCH MEMBER</span>
                <span className="profile-player-name">{user?.name || 'Anonymous User'}</span>
              </div>
              <button
                onClick={() => { playSound('click', isMuted); setShowProfileModal(false); }}
                onMouseEnter={() => playSound('hover', isMuted)}
                className="neo-box-interactive"
                style={{
                  width: '38px',
                  height: '38px',
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                  border: 'var(--neo-border-thin)',
                  boxShadow: '2px 2px 0 #000',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Details Section */}
            <div className="profile-section-title">
              <span>COORDINATES & SPECS</span>
            </div>
            <div className="profile-details-grid">
              <div className="profile-detail-card">
                <div className="profile-detail-label">PHONE NUMBER</div>
                <div className="profile-detail-value">{user?.phone}</div>
              </div>
              <div className="profile-detail-card">
                <div className="profile-detail-label">EMAIL ADDRESS</div>
                <div className="profile-detail-value">{user?.email || 'N/A'}</div>
              </div>
              <div className="profile-detail-card">
                <div className="profile-detail-label">SHIPPING COORDINATES (ADDRESS)</div>
                <textarea
                  className="profile-address-edit"
                  rows="2"
                  value={user?.address || ''}
                  onChange={handleAddressChange}
                  placeholder="Enter coordinate address..."
                />
              </div>
            </div>

            {/* Current Cart Inventory */}
            <div className="profile-section-title">
              <span>CURRENT INVENTORY (CART)</span>
              <span>{totalItems} ITEMS</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', maxHeight: '180px', overflowY: 'auto' }} className="custom-scrollbar">
              {cart.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 'bold' }}>Active cart is empty. Go secure some crunch! 🛒</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    border: 'var(--neo-border-thin)',
                    borderRadius: '12px',
                    backgroundColor: 'var(--theme-card-bg)',
                    fontSize: '0.85rem',
                    boxShadow: '2px 2px 0 #000'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                      <span style={{ fontWeight: 'bold', color: '#000' }}>{item.name.replace('Roasted Makhana - ', '')}</span>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 'bold' }}>₹{item.price * item.qty}</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: 'var(--neo-border-thin)', borderRadius: '6px', overflow: 'hidden', height: '24px', backgroundColor: '#fff' }}>
                        <button onClick={() => updateCartQty(item.id, -1)} style={{ padding: '0 8px', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' }}>-</button>
                        <span style={{ padding: '0 8px', background: '#000', color: '#fff', fontWeight: 'bold', fontSize: '0.75rem', lineHeight: '24px' }}>{item.qty}</span>
                        <button onClick={() => updateCartQty(item.id, 1)} style={{ padding: '0 8px', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' }}>+</button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Wishlist Section */}
            <div
              className="profile-section-title wishlist-open-btn"
              style={{ marginTop: '20px', cursor: 'pointer' }}
              onClick={() => {
                setShowProfileModal(false);
                setCurrentPage('wishlist');
                window.scrollTo(0, 0);
              }}
            >
              <span>MY WISHLIST ↗</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={14} fill="#ff0055" color="#ff0055" />
                {wishlist.length} ITEMS
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 700, textAlign: 'left', padding: '6px 0 18px', letterSpacing: '0.5px' }}>
              {wishlist.length === 0 ? 'No saved drips yet. Tap 🤍 on a product!' : `${wishlist.length} item${wishlist.length > 1 ? 's' : ''} waiting for you ✨ — tap to view all`}
            </p>

            {/* Snack Log (Previous Orders) */}
            <div className="profile-section-title">
              <span>SNACK LOG (ORDER HISTORY)</span>
              <span>{ordersList.length} LOGS</span>
            </div>
            <div className="orders-log-list custom-scrollbar">
              {ordersList.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 'bold', padding: '10px 0' }}>No historical transactions. Buy something, literally! 💀</p>
              ) : (
                ordersList.map(order => (
                  <div key={order.id} className="order-receipt-card">
                    <div className="order-receipt-header">
                      <span>{order.id}</span>
                      <span>{order.date}</span>
                    </div>
                    <div className="order-receipt-summary">
                      {order.items}
                    </div>
                    <div className="order-receipt-footer">
                      <span className="order-receipt-status">● {order.status}</span>
                      <span className="order-receipt-total">₹{order.total}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Logout button */}
            <div style={{ marginTop: 'auto' }}>
              <button
                className="neo-btn"
                onClick={() => {
                  playSound('laser', isMuted);
                  setUser(null);
                  localStorage.removeItem('soul_user');
                  setCart([]);
                  setWishlist([]);
                  setShowProfileModal(false);
                }}
                onMouseEnter={() => playSound('hover', isMuted)}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  boxShadow: '3px 3px 0 #000',
                  border: 'var(--neo-border-thin)'
                }}
              >
                DISCONNECT SYSTEM (LOGOUT)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMS TOAST SIMULATOR */}
      {smsToast.visible && (
        <div className="sms-toast-container">
          <div className="sms-toast">
            <div className="sms-toast-header">
              <span>💬 SMS NOTIFICATION // IMESSAGE</span>
              <button 
                onClick={() => setSmsToast({ visible: false, message: '', code: '' })} 
                style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
              >
                DISMISS
              </button>
            </div>
            <div className="sms-toast-body">
              {smsToast.message}
              <div>
                Your OTP code is: <span className="sms-toast-code">{smsToast.code}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RETRO RECEIPT DIALOG PANEL */}
      {activeReceipt && (
        <div className="modal-overlay" onClick={() => setActiveReceipt(null)}>
          <div className="login-console-box" style={{ borderColor: 'var(--theme-accent)', maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="login-header">
              <span className="login-title" style={{ fontFamily: 'var(--font-header)', fontWeight: 900, color: 'var(--theme-accent-dark)' }}>✦ SECURE RECEIPT</span>
              <button
                onClick={() => { playSound('click', isMuted); setActiveReceipt(null); }}
                className="neo-box-interactive"
                style={{
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                  border: 'var(--neo-border-thin)',
                  boxShadow: '2px 2px 0 #000',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '0.85rem', color: '#000', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ borderBottom: '1px dashed #000', paddingBottom: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>ORDER ID:</span>
                <span style={{ fontWeight: 'bold' }}>{activeReceipt.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>TIMESTAMP:</span>
                <span>{activeReceipt.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>BUYER TAG:</span>
                <span>{user?.name}</span>
              </div>
              <div style={{ borderBottom: '1px dashed #000', paddingBottom: '8px', marginBottom: '8px' }}>
                <span style={{ display: 'block', color: '#6b7280', fontSize: '0.75rem', marginBottom: '4px' }}>ITEMS:</span>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#111' }}>{activeReceipt.items}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 900, color: 'var(--theme-accent-dark)' }}>
                <span>TOTAL SECURED:</span>
                <span>₹{activeReceipt.total}</span>
              </div>
              <div style={{ marginTop: '16px', padding: '10px', backgroundColor: 'rgba(34,197,94,0.15)', border: '1px dashed #22c55e', color: '#15803d', textAlign: 'center', fontWeight: 'bold' }}>
                ● STATUS: BATCH IS ROASTING 💯
              </div>
            </div>
            <button
              onClick={() => { playSound('click', isMuted); setActiveReceipt(null); }}
              className="neo-btn"
              style={{ width: '100%', justifyContent: 'center', marginTop: '20px', padding: '12px 0' }}
            >
              DISMISS LOG ✦
            </button>
          </div>
        </div>
      )}

      {/* 8.6. PRODUCT DETAIL ZOOM MODAL */}
      {selectedProduct && 
       currentPage !== 'product-detail' && 
       currentPage !== 'checkout' && 
       currentPage !== 'catalog' && 
       currentPage !== 'home' && 
       currentPage !== 'wishlist' && 
       currentPage !== 'customized' && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="product-detail-modal-box" onClick={(e) => e.stopPropagation()}>
            {/* Left side image and weight badge */}
            <div>
              <div className="detail-img-wrapper">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
                <span className="detail-badge-pill">{selectedProduct.weight} NET WT</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.65rem', color: '#6b7280', fontWeight: 'bold' }}>ENERGY RATING</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#000' }}>⚡ {selectedProduct.calories}</span>
              </div>
            </div>

            {/* Right side info panel */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h2 style={{ fontFamily: 'var(--font-header)', fontSize: '1.5rem', fontWeight: 900, color: '#000', lineHeight: 1.1, flexGrow: 1, paddingRight: '12px' }}>
                  {selectedProduct.name}
                </h2>
                <button
                  onClick={() => { playSound('click', isMuted); setSelectedProduct(null); }}
                  className="neo-box-interactive"
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    border: 'var(--neo-border-thin)',
                    boxShadow: '2px 2px 0 #000',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <p className="detail-desc">{selectedProduct.desc}</p>

              {/* Offer Panel */}
              <div className="offer-console-box">
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>⚡ SPECIAL SYSTEM BUNDLE OFFER:</span>
                <span>{selectedProduct.offerLabel}</span>
                <div style={{ marginTop: '6px' }}>
                  Code: <span className="offer-console-code">{selectedProduct.offerCode}</span>
                </div>
              </div>

              {/* Flavor Chemistry Slider */}
              <div className="chemistry-container">
                <span className="chemistry-title">// FLAVOR COMPOSITION CHEMISTRY</span>
                <div className="chem-bar-row">
                  <div className="chem-bar-label">
                    <span>{selectedProduct.flavorDetails.primaryName}</span>
                    <span>{selectedProduct.flavorDetails.primaryPct}%</span>
                  </div>
                  <div className="chem-bar-outer">
                    <div className="chem-bar-inner" style={{ width: `${selectedProduct.flavorDetails.primaryPct}%`, backgroundColor: selectedProduct.color }} />
                  </div>
                </div>
                <div className="chem-bar-row">
                  <div className="chem-bar-label">
                    <span>{selectedProduct.flavorDetails.secondaryName}</span>
                    <span>{selectedProduct.flavorDetails.secondaryPct}%</span>
                  </div>
                  <div className="chem-bar-outer">
                    <div className="chem-bar-inner" style={{ width: `${selectedProduct.flavorDetails.secondaryPct}%`, backgroundColor: 'var(--theme-accent)' }} />
                  </div>
                </div>
              </div>

              {/* RPG Stats Comparison inside details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginBottom: '20px'
              }}>
                <div style={{ border: 'var(--neo-border-thin)', borderRadius: '10px', padding: '6px', textAlign: 'center', backgroundColor: '#f9fafb' }}>
                  <span style={{ display: 'block', fontSize: '0.55rem', fontFamily: 'var(--font-tech)', color: '#6b7280', fontWeight: 'bold' }}>HP VALUE</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#15803d' }}>{selectedProduct.healthStats.hp}</span>
                </div>
                <div style={{ border: 'var(--neo-border-thin)', borderRadius: '10px', padding: '6px', textAlign: 'center', backgroundColor: '#f9fafb' }}>
                  <span style={{ display: 'block', fontSize: '0.55rem', fontFamily: 'var(--font-tech)', color: '#6b7280', fontWeight: 'bold' }}>PROTEIN</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#000' }}>{selectedProduct.healthStats.protein}</span>
                </div>
                <div style={{ border: 'var(--neo-border-thin)', borderRadius: '10px', padding: '6px', textAlign: 'center', backgroundColor: '#f9fafb' }}>
                  <span style={{ display: 'block', fontSize: '0.55rem', fontFamily: 'var(--font-tech)', color: '#6b7280', fontWeight: 'bold' }}>FIBER</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#000' }}>{selectedProduct.healthStats.fiber}</span>
                </div>
                <div style={{ border: 'var(--neo-border-thin)', borderRadius: '10px', padding: '6px', textAlign: 'center', backgroundColor: '#f9fafb' }}>
                  <span style={{ display: 'block', fontSize: '0.55rem', fontFamily: 'var(--font-tech)', color: '#6b7280', fontWeight: 'bold' }}>GUILT DEBUFF</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#dc2626' }}>{selectedProduct.healthStats.guilt}%</span>
                </div>
              </div>

              {/* Action Button inside detail card */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  className="neo-btn"
                  onClick={(e) => {
                    addToCart(selectedProduct, e);
                    setSelectedProduct(null);
                  }}
                  onMouseEnter={() => playSound('hover', isMuted)}
                  style={{ flexGrow: 1, justifyContent: 'center', padding: '12px 0', fontSize: '0.9rem', boxShadow: '3px 3px 0 #000' }}
                >
                  SECURE THIS DRIP (ADD BAG) ✦
                </button>
                <button
                  className="neo-btn"
                  onClick={() => {
                    toggleWishlist(selectedProduct);
                  }}
                  onMouseEnter={() => playSound('hover', isMuted)}
                  style={{ 
                    width: '48px', 
                    justifyContent: 'center', 
                    padding: '12px 0', 
                    fontSize: '0.9rem', 
                    boxShadow: '3px 3px 0 #000',
                    backgroundColor: wishlist.find(w => w.id === selectedProduct.id) ? '#ff0055' : '#fff',
                    color: wishlist.find(w => w.id === selectedProduct.id) ? '#fff' : '#000'
                  }}
                >
                  <Heart size={18} fill={wishlist.find(w => w.id === selectedProduct.id) ? "#fff" : "none"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. LEGAL POLICY MODAL */}
      {activePolicy && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 600,
          padding: '20px'
        }}>
          <div className="neo-box" style={{
            width: '100%',
            maxWidth: '560px',
            backgroundColor: '#fff',
            border: 'var(--neo-border)',
            boxShadow: '10px 10px 0px #000',
            borderRadius: '24px',
            padding: '30px',
            color: '#000',
            textAlign: 'left',
            position: 'relative',
            animation: 'zoom-in-modal 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: 'var(--neo-border-thin)', paddingBottom: '14px' }}>
              <h3 style={{
                fontFamily: 'var(--font-header)',
                fontSize: '1.5rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                margin: 0
              }}>
                {activePolicy === 'privacy' && 'Privacy Policy'}
                {activePolicy === 'terms' && 'Terms & Conditions'}
                {activePolicy === 'refund' && 'Return & Refund'}
              </h3>
              <button 
                onClick={() => { playSound('click', isMuted); setActivePolicy(null); }}
                style={{
                  background: 'none',
                  border: 'var(--neo-border-thin)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '2px 2px 0 #000',
                  cursor: 'pointer',
                  backgroundColor: '#fff'
                }}
                onMouseEnter={() => playSound('hover', isMuted)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Content body */}
            <div style={{ 
              maxHeight: '300px', 
              overflowY: 'auto', 
              fontFamily: 'var(--font-body)', 
              fontSize: '0.9rem', 
              lineHeight: 1.6, 
              color: '#374151',
              paddingRight: '8px',
              marginBottom: '24px'
            }} className="custom-scrollbar">
              {activePolicy === 'privacy' && (
                <div>
                  <p style={{ fontWeight: 'bold', color: '#111827' }}>XYZ Privacy Policy Placeholder</p>
                  <p>Welcome to the Soul Fuel Lite Legal System. Your privacy is critical to us. We will update the official Privacy Policy documentation shortly.</p>
                  <p>Currently, the user profile and session authentication are stored locally on your device using browser `localStorage` parameters to ensure full client-side isolation and storage integrity.</p>
                  <p>For questions or custom data requests, please contact our support team. (This section will be replaced with official terms by the administrator.)</p>
                </div>
              )}
              {activePolicy === 'terms' && (
                <div>
                  <p style={{ fontWeight: 'bold', color: '#111827' }}>XYZ Terms & Conditions Placeholder</p>
                  <p>Welcome to the Soul Fuel Lite Legal System. By accessing or using this website, you agree to comply with and be bound by the Terms and Conditions of this service.</p>
                  <p>All active brand elements, visual designs, and retro Y2K aesthetics belong to Fox & Lotus brand creators. Any unauthorized replication of the flavor synthesized catalog or sound assets is prohibited.</p>
                  <p>Official Terms & Conditions paperwork will be loaded here by the administrator soon.</p>
                </div>
              )}
              {activePolicy === 'refund' && (
                <div>
                  <p style={{ fontWeight: 'bold', color: '#111827' }}>XYZ Return & Refund Policy Placeholder</p>
                  <p>Welcome to the Soul Fuel Lite Legal System. We strive to provide the crispiest, highest-quality popped makhana seeds.</p>
                  <p>If you encounter any issues with flavor consistency or batch quality, please reach out. We are committed to resolving your concern or providing a refund depending on active conditions.</p>
                  <p>Detailed return shipping guidelines and refund parameters will be updated here shortly by the administrator.</p>
                </div>
              )}
            </div>

            {/* Action button */}
            <button 
              className="neo-btn" 
              onClick={() => { playSound('click', isMuted); setActivePolicy(null); }}
              style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: '0.9rem', boxShadow: '3px 3px 0 #000' }}
              onMouseEnter={() => playSound('hover', isMuted)}
            >
              CLOSE TERMINAL ✦
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
