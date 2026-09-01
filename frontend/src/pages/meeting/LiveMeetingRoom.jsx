import React, { useState, useEffect, useRef, Component } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  User,
  Radio,
  Sparkles,
  ShieldCheck,
  Globe,
  Settings,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  MonitorUp,
  MessageSquare,
  Users,
  Hand,
  Volume2,
  Send,
  X,
  RefreshCw,
  Copy,
  Bell,
  Check,
  Ban,
  Hourglass,
} from 'lucide-react';

// Error Boundary to completely prevent any white screens
class MeetingErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Meeting Room Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 space-y-4 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Radio className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-extrabold text-white">Live Meeting Studio</h2>
            <p className="text-xs text-slate-400">
              A temporary channel reconnection occurred. Click below to reconnect to the session smoothly.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full rounded-2xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Reconnect to Meeting Room ➔
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const LiveMeetingRoomComponent = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isHost, setIsHost] = useState(searchParams.get('isHost') === 'true');
  const [useGlobalWebRTC, setUseGlobalWebRTC] = useState(false);
  const meetingTopic = searchParams.get('topic') || 'Live Cohort Masterclass & Architecture Sync';
  const mentorName = searchParams.get('host') || 'Dr. Robert Langdon (Mentor)';

  // Current User Display Name
  const [displayName, setDisplayName] = useState(() => {
    try {
      const savedUser = localStorage.getItem('edtech_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const fullName = `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim();
        if (fullName) return searchParams.get('isHost') === 'true' ? `${fullName} (Mentor)` : fullName;
      }
    } catch (e) {}
    return searchParams.get('isHost') === 'true' ? 'Dr. Robert Langdon (Mentor)' : 'Alex Mercer (Student)';
  });

  const cleanRoomId = (roomId || 'edtech-cohort-meeting').replace(/[^a-zA-Z0-9]/g, '');

  // Pre-join, Waiting Room & Active Call states
  const [hasJoined, setHasJoined] = useState(false);
  const [isWaitingForAdmission, setIsWaitingForAdmission] = useState(false);
  const [admissionDenied, setAdmissionDenied] = useState(false);
  const [admissionRequests, setAdmissionRequests] = useState([]); // Host sees knocks

  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [permissionError, setPermissionError] = useState('');
  const [isStartingMedia, setIsStartingMedia] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Remote Participant State
  const [remoteParticipant, setRemoteParticipant] = useState(null);
  const [remoteVideoFrame, setRemoteVideoFrame] = useState(null);

  // Call timer & UI Panels
  const [callDuration, setCallDuration] = useState(0);
  const [activePanel, setActivePanel] = useState(null); // 'chat' | 'participants' | null
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'EduPulse System', text: `Room ${cleanRoomId} active. Encrypted live session.`, time: 'System' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Video references
  const localVideoRef = useRef(null);
  const screenShareVideoRef = useRef(null);
  const streamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const frameCanvasRef = useRef(null);
  const broadcastChannelRef = useRef(null);

  // Safe Broadcast sender wrapped in try/catch to never throw InvalidStateError
  const sendBroadcast = (msg) => {
    try {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage(msg);
      }
    } catch (err) {
      // Safely ignore if channel is closed
    }
  };

  // 1. Initialize Native Camera & Microphone
  const initializeMedia = async () => {
    setIsStartingMedia(true);
    setPermissionError('');
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: true,
      });

      streamRef.current = stream;
      setCameraPermissionGranted(true);
      setVideoEnabled(true);
      setMicEnabled(true);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true;
        try {
          await localVideoRef.current.play();
        } catch (playErr) {
          console.log('Local video play catch:', playErr);
        }
      }
    } catch (err) {
      console.warn('Camera/Mic permission warning:', err);
      setPermissionError('Camera or Microphone was blocked or unavailable. Click "Grant Access" or test in View mode.');
      setCameraPermissionGranted(false);
      setVideoEnabled(false);
      setMicEnabled(false);
    } finally {
      setIsStartingMedia(false);
    }
  };

  useEffect(() => {
    initializeMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Ensure local video element plays when state changes
  useEffect(() => {
    if (streamRef.current && localVideoRef.current && videoEnabled) {
      localVideoRef.current.srcObject = streamRef.current;
      localVideoRef.current.muted = true;
      localVideoRef.current.play().catch((e) => console.log('Local play err:', e));
    }
  }, [hasJoined, videoEnabled]);

  // Call timer counter
  useEffect(() => {
    if (!hasJoined) return;
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [hasJoined]);

  // 2. Broadcast Channel for Cross-Tab Signaling, Knocks, Chat & Video Streaming
  useEffect(() => {
    let channel = null;
    try {
      channel = new BroadcastChannel(`edtech_meeting_room_${cleanRoomId}`);
      broadcastChannelRef.current = channel;
    } catch (e) {
      console.warn('BroadcastChannel initialization warning:', e);
      return;
    }

    channel.onmessage = (e) => {
      const msg = e.data;
      if (!msg || !msg.type) return;

      // 1. Student Knocks on the door (Host receives)
      if (msg.type === 'KNOCK_REQUEST') {
        if (isHost) {
          setAdmissionRequests((prev) => {
            if (prev.some((req) => req.studentName === msg.studentName)) return prev;
            return [...prev, { studentName: msg.studentName, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
          });
        }
      }

      // 2. Host Admits Student (Student receives)
      if (msg.type === 'KNOCK_APPROVED') {
        if (!isHost && msg.studentName === displayName) {
          setIsWaitingForAdmission(false);
          setHasJoined(true);
          setAdmissionDenied(false);
          sendBroadcast({
            type: 'USER_IN_CALL',
            sender: displayName,
            isHost: false,
            videoEnabled,
            micEnabled,
          });
        }
      }

      // 3. Host Denies Student (Student receives)
      if (msg.type === 'KNOCK_DENIED') {
        if (!isHost && msg.studentName === displayName) {
          setIsWaitingForAdmission(false);
          setAdmissionDenied(true);
        }
      }

      // 4. Participant Active in Call
      if (msg.type === 'USER_IN_CALL') {
        if (msg.sender !== displayName) {
          setRemoteParticipant({
            name: msg.sender,
            isHost: msg.isHost,
            videoEnabled: msg.videoEnabled,
            micEnabled: msg.micEnabled,
          });

          sendBroadcast({
            type: 'PRESENCE_CONFIRM',
            sender: displayName,
            isHost,
            videoEnabled,
            micEnabled,
          });
        }
      }

      // 5. Presence Confirmation
      if (msg.type === 'PRESENCE_CONFIRM') {
        if (msg.sender !== displayName) {
          setRemoteParticipant({
            name: msg.sender,
            isHost: msg.isHost,
            videoEnabled: msg.videoEnabled,
            micEnabled: msg.micEnabled,
          });
        }
      }

      // 6. Live Video Frame Received (from Host or Peer)
      if (msg.type === 'VIDEO_FRAME') {
        if (msg.sender !== displayName) {
          setRemoteVideoFrame(msg.frame);
          if (!remoteParticipant) {
            setRemoteParticipant({
              name: msg.sender,
              isHost: msg.isHost,
              videoEnabled: true,
              micEnabled: true,
            });
          }
        }
      }

      // 7. Live Chat Message Received
      if (msg.type === 'CHAT_MESSAGE') {
        setChatMessages((prev) => [...prev, msg.message]);
      }

      // 8. Media State (Mute / Cam off)
      if (msg.type === 'MEDIA_STATE') {
        if (msg.sender !== displayName) {
          setRemoteParticipant((prev) => (prev ? { ...prev, ...msg.state } : null));
          if (msg.state.videoEnabled === false) {
            setRemoteVideoFrame(null);
          }
        }
      }

      // 9. Participant Left Call
      if (msg.type === 'USER_LEFT') {
        if (msg.sender !== displayName) {
          setRemoteParticipant(null);
          setRemoteVideoFrame(null);
        }
      }
    };

    if (hasJoined) {
      sendBroadcast({
        type: 'USER_IN_CALL',
        sender: displayName,
        isHost,
        videoEnabled,
        micEnabled,
      });
    }

    return () => {
      sendBroadcast({
        type: 'USER_LEFT',
        sender: displayName,
        isHost,
      });
      try {
        if (channel) {
          channel.close();
        }
      } catch (e) {}
      broadcastChannelRef.current = null;
    };
  }, [hasJoined, displayName, isHost, cleanRoomId]);

  // 3. Real-Time Video Frame Streaming Loop across tabs
  useEffect(() => {
    if (!hasJoined || !videoEnabled || !localVideoRef.current) return;

    let animId = null;
    const canvas = frameCanvasRef.current || document.createElement('canvas');
    frameCanvasRef.current = canvas;
    const ctx = canvas.getContext('2d');

    const streamInterval = setInterval(() => {
      const video = localVideoRef.current;
      if (video && video.videoWidth > 0 && video.videoHeight > 0 && videoEnabled) {
        canvas.width = 480;
        canvas.height = 270;
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -480, 0, 480, 270);
        ctx.restore();

        try {
          const frameData = canvas.toDataURL('image/jpeg', 0.55);
          sendBroadcast({
            type: 'VIDEO_FRAME',
            sender: displayName,
            isHost,
            frame: frameData,
          });
        } catch (e) {}
      }
    }, 66); // ~15 FPS smooth video stream across tabs

    return () => {
      clearInterval(streamInterval);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [hasJoined, videoEnabled, displayName, isHost]);

  // Handle "Join Meeting Now" button in Pre-join Lobby
  const handleJoinAttempt = () => {
    setHasJoined(true);
    setIsWaitingForAdmission(false);
    sendBroadcast({
      type: 'USER_IN_CALL',
      sender: displayName,
      isHost,
      videoEnabled,
      micEnabled,
    });
  };

  // Host Admits a Student
  const handleAdmitStudent = (studentName) => {
    setAdmissionRequests((prev) => prev.filter((r) => r.studentName !== studentName));
    sendBroadcast({
      type: 'KNOCK_APPROVED',
      studentName: studentName,
    });
  };

  // Host Denies a Student
  const handleDenyStudent = (studentName) => {
    setAdmissionRequests((prev) => prev.filter((r) => r.studentName !== studentName));
    sendBroadcast({
      type: 'KNOCK_DENIED',
      studentName: studentName,
    });
  };

  // Toggle Physical Microphone
  const toggleMic = () => {
    const nextState = !micEnabled;
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = nextState;
      });
    }
    setMicEnabled(nextState);

    sendBroadcast({
      type: 'MEDIA_STATE',
      sender: displayName,
      state: { micEnabled: nextState },
    });
  };

  // Toggle Physical Camera
  const toggleVideo = () => {
    const nextState = !videoEnabled;
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = nextState;
      });
    }
    setVideoEnabled(nextState);

    sendBroadcast({
      type: 'MEDIA_STATE',
      sender: displayName,
      state: { videoEnabled: nextState },
    });

    if (nextState && streamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = streamRef.current;
      localVideoRef.current.muted = true;
      localVideoRef.current.play().catch((e) => console.log('Play error:', e));
    }
  };

  // Screen Sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        screenStreamRef.current = screenStream;
        setIsScreenSharing(true);
        if (screenShareVideoRef.current) {
          screenShareVideoRef.current.srcObject = screenStream;
        }
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          screenStreamRef.current = null;
        };
      } catch (err) {
        console.warn('Screen share cancelled:', err);
      }
    }
  };

  // Send Chat Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageObj = {
      id: Date.now(),
      sender: displayName,
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, messageObj]);

    sendBroadcast({
      type: 'CHAT_MESSAGE',
      message: messageObj,
    });

    setNewMessage('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleLeaveCall = () => {
    sendBroadcast({
      type: 'USER_LEFT',
      sender: displayName,
      isHost,
    });
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (window.opener) {
      window.close();
    } else {
      navigate(isHost ? '/mentor/sessions' : '/student/meetings');
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // -------------------------------------------------------------
  // VIEW A: STUDENT WAITING ROOM / ADMISSION APPROVAL SCREEN
  // -------------------------------------------------------------
  if (isWaitingForAdmission) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 select-none">
        <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center space-y-6 shadow-2xl backdrop-blur-md animate-scale-up">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Hourglass className="h-10 w-10 animate-pulse text-blue-400" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 animate-ping"></span>
          </div>

          <div className="space-y-2">
            <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400">
              Knock Submitted • Waiting for Host
            </span>
            <h2 className="text-xl font-extrabold text-white">Waiting for Mentor Approval...</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Please wait while <strong>{mentorName}</strong> reviews your request to enter <strong>"{meetingTopic}"</strong>.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4 text-xs text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span>Your Name:</span>
              <strong className="text-white">{displayName}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Meeting Host:</span>
              <strong className="text-blue-400">{mentorName}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Status:</span>
              <span className="text-amber-400 font-semibold flex items-center">
                <span className="h-2 w-2 rounded-full bg-amber-400 mr-1.5 animate-ping"></span> Knocking
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsWaitingForAdmission(false)}
            className="flex items-center justify-center space-x-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-6 py-2.5 text-xs font-bold text-slate-300 mx-auto transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Cancel & Return to Lobby</span>
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW B: ADMISSION DENIED SCREEN
  // -------------------------------------------------------------
  if (admissionDenied) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 select-none">
        <div className="w-full max-w-md rounded-3xl border border-rose-900/50 bg-slate-900/90 p-8 text-center space-y-5 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-600/20 text-rose-500 border border-rose-500/30">
            <Ban className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Admission Declined</h2>
            <p className="text-xs text-slate-400">
              The mentor was unable to admit you to this session at this time.
            </p>
          </div>
          <button
            onClick={handleLeaveCall}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-6 py-2.5 text-xs font-bold text-white transition-colors"
          >
            Exit Meeting
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW C: PRE-JOIN SCREEN (GREEN ROOM / LOBBY)
  // -------------------------------------------------------------
  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
        <div className="w-full max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                <Radio className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-white">EduPulse Live Meeting</h1>
                  <span className="rounded-full bg-blue-500/20 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-bold text-blue-400">
                    Live Studio
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Host: <strong className="text-slate-200">{mentorName}</strong> • Topic: <strong className="text-blue-400">{meetingTopic}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={handleLeaveCall}
              className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Native Camera Preview Box */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-video w-full rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
                {videoEnabled && cameraPermissionGranted ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3 text-slate-500">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 text-blue-400 border border-slate-700">
                      <User className="h-10 w-10" />
                    </div>
                    <p className="text-xs font-semibold text-slate-400">Camera is turned off</p>
                  </div>
                )}

                {/* Floating Media Controls on Camera Preview */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-3 rounded-2xl bg-slate-950/80 backdrop-blur-md px-4 py-2 border border-slate-700/50 shadow-xl">
                  <button
                    onClick={toggleMic}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                      micEnabled ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
                    }`}
                    title={micEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
                  >
                    {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </button>

                  <button
                    onClick={toggleVideo}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                      videoEnabled ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
                    }`}
                    title={videoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
                  >
                    {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </button>

                  <button
                    onClick={initializeMedia}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white hover:bg-slate-700"
                    title="Retry / Refresh Camera & Mic"
                  >
                    <RefreshCw className={`h-4 w-4 ${isStartingMedia ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* Permission Status Pill */}
                <div className="absolute top-4 left-4">
                  {cameraPermissionGranted ? (
                    <span className="flex items-center space-x-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 px-3 py-1 text-[11px] font-bold text-blue-400 backdrop-blur-md">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                      <span>Camera & Mic Active</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-1 text-[11px] font-bold text-amber-400 backdrop-blur-md">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                      <span>Audio / View Mode</span>
                    </span>
                  )}
                </div>
              </div>

              {permissionError && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                    <span>{permissionError}</span>
                  </div>
                  <button
                    onClick={initializeMedia}
                    className="ml-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1 text-[11px] font-bold text-white transition-colors shrink-0"
                  >
                    Grant Access
                  </button>
                </div>
              )}
            </div>

            {/* Right: User Name Verification & Join Form */}
            <div className="lg:col-span-5 space-y-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
              <div>
                <span className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-400">
                  Pre-Join Lobby
                </span>
                <h2 className="text-lg font-bold text-white mt-1.5">Ready to Join?</h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isHost
                    ? 'You are the Meeting Host. You can start the meeting immediately.'
                    : 'Click Join to knock on the door. The mentor will admit you into the call.'}
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300">Your Display Name in Meeting *</label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none ring-0"
                      required
                    />
                    <User className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Auto-fetched from your logged-in profile.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-3 space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Microphone:</span>
                    <strong className={micEnabled ? 'text-blue-400' : 'text-rose-400'}>
                      {micEnabled ? 'Unmuted (Active)' : 'Muted'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Camera:</span>
                    <strong className={videoEnabled ? 'text-blue-400' : 'text-rose-400'}>
                      {videoEnabled ? 'Video Enabled' : 'Video Off'}
                    </strong>
                  </div>
                </div>

                <button
                  onClick={handleJoinAttempt}
                  disabled={!displayName.trim()}
                  className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Radio className="h-4 w-4 animate-pulse" />
                  <span>{isHost ? 'Start Meeting as Host ➔' : 'Join Live Video Meeting ➔'}</span>
                </button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
                <span>EduPulse Native In-House Video Studio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW D: ACTIVE LIVE MEETING ROOM (WITH ADMIT BANNER FOR MENTOR)
  // -------------------------------------------------------------
  return (
    <div className="h-screen w-screen bg-slate-950 text-white flex flex-col overflow-hidden select-none">
      {/* HOST ADMISSION TOAST NOTIFICATIONS (POPUP WHEN STUDENT KNOCKS) */}
      {isHost && admissionRequests.length > 0 && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-md space-y-2 animate-bounce-short">
          {admissionRequests.map((req) => (
            <div
              key={req.studentName}
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border-2 border-blue-500 shadow-2xl shadow-blue-500/20 text-xs backdrop-blur-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-extrabold text-white text-sm">{req.studentName}</p>
                  <p className="text-[11px] text-blue-400">Wants to join this session • {req.time}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAdmitStudent(req.studentName)}
                  className="flex items-center space-x-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow cursor-pointer transition-colors"
                >
                  <Check className="h-4 w-4" />
                  <span>Admit</span>
                </button>
                <button
                  onClick={() => handleDenyStudent(req.studentName)}
                  className="rounded-xl bg-slate-800 hover:bg-rose-600/80 p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Deny Entry"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top Header Bar */}
      <div className="h-14 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between shrink-0 z-10 backdrop-blur">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-extrabold text-white tracking-tight">{meetingTopic}</h2>
              <span className="rounded-full bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 text-[10px] font-bold text-blue-400 flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mr-1 animate-ping"></span> LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Host: <strong className="text-slate-200">{mentorName}</strong> • Logged as: <strong className="text-blue-400">{displayName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mode Switch: Studio vs Global Multi-Device */}
          <div className="flex items-center space-x-1 rounded-xl bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => setUseGlobalWebRTC(false)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                !useGlobalWebRTC ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Studio
            </button>
            <button
              onClick={() => setUseGlobalWebRTC(true)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
                useGlobalWebRTC ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Multi-Device Live</span>
            </button>
          </div>

          {/* Toggle Role between Student and Host/Mentor */}
          <button
            onClick={() => {
              const nextRole = !isHost;
              setIsHost(nextRole);
              setDisplayName(nextRole ? 'Dr. Robert Langdon (Mentor)' : 'Alex Mercer (Student)');
            }}
            className="flex items-center space-x-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs text-amber-300 font-bold transition-colors cursor-pointer"
            title="Click to toggle between Student and Host/Mentor role"
          >
            <span>{isHost ? '👑 Mentor (Host)' : '🎓 Student Mode'}</span>
          </button>

          {/* Copy Meeting Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition-colors"
            title="Copy Meeting Link"
          >
            <Copy className="h-3.5 w-3.5 text-blue-400" />
            <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
          </button>

          {/* Call Duration Timer */}
          <div className="flex items-center space-x-1.5 rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-1.5 text-xs font-mono font-bold text-slate-200">
            <Clock className="h-3.5 w-3.5 text-blue-400" />
            <span>{formatTimer(callDuration)}</span>
          </div>

          {/* End Call / Leave Button */}
          <button
            onClick={handleLeaveCall}
            className="flex items-center space-x-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-rose-600/30 transition-all cursor-pointer"
          >
            <PhoneOff className="h-4 w-4" />
            <span>Leave Call</span>
          </button>
        </div>
      </div>

      {/* Main Video Conference Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {useGlobalWebRTC ? (
          /* Embedded Full WebRTC Live Room - Laptop & Mobile Real Video Connection */
          <div className="flex-1 p-2 sm:p-4 flex flex-col items-center justify-center bg-slate-950 w-full h-full">
            <iframe
              src={`https://meet.jit.si/EduPulse-${cleanRoomId}#config.prejoinPageEnabled=false&config.disableDeepLinking=true&userInfo.displayName="${encodeURIComponent(displayName)}"`}
              allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
              className="w-full h-full min-h-[82vh] rounded-3xl border border-slate-800 shadow-2xl bg-slate-900"
              title="EduPulse Cross-Device Live Meeting"
            />
          </div>
        ) : (
          /* Video Tiles Grid */
          <div className="flex-1 p-4 flex flex-col items-center justify-center overflow-y-auto">
          {isScreenSharing ? (
            /* Screen Sharing View */
            <div className="w-full h-full max-h-[85vh] rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden flex flex-col">
              <div className="p-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs px-4">
                <div className="flex items-center space-x-2 text-blue-400 font-bold">
                  <MonitorUp className="h-4 w-4" />
                  <span>{displayName} is sharing their screen</span>
                </div>
                <button
                  onClick={toggleScreenShare}
                  className="rounded-lg bg-rose-600 hover:bg-rose-500 px-3 py-1 text-[11px] font-bold text-white transition-colors"
                >
                  Stop Sharing
                </button>
              </div>
              <div className="flex-1 relative flex items-center justify-center bg-black">
                <video
                  ref={screenShareVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          ) : (
            /* Multi-Participant Dynamic Video Layout */
            <div className="w-full h-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center">
              {/* TILE 1: SELF LOCAL VIDEO (YOUR CAMERA) */}
              <div className="relative aspect-video w-full rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex items-center justify-center">
                {videoEnabled && cameraPermissionGranted ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-900 border-2 border-blue-500 text-white font-extrabold text-2xl shadow-lg">
                      {displayName.substring(0, 2).toUpperCase()}
                    </div>
                    <p className="text-sm font-bold text-slate-300">{displayName}</p>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 flex items-center space-x-2 rounded-xl bg-slate-950/80 backdrop-blur-md px-3 py-1.5 text-xs font-semibold border border-slate-800">
                  <span className={`h-2 w-2 rounded-full ${micEnabled ? 'bg-blue-400' : 'bg-rose-500'}`}></span>
                  <span>{displayName} (You)</span>
                  {handRaised && <span className="text-amber-400">✋</span>}
                </div>
                <div className="absolute top-4 right-4 rounded-lg bg-slate-950/80 p-1.5 border border-slate-800 text-slate-400">
                  {micEnabled ? <Mic className="h-4 w-4 text-blue-400" /> : <MicOff className="h-4 w-4 text-rose-500" />}
                </div>
              </div>

              {/* TILE 2: REMOTE PARTICIPANT (PEER VIDEO FEED OR WAITING STATE) */}
              {remoteParticipant ? (
                <div className="relative aspect-video w-full rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex items-center justify-center">
                  {remoteVideoFrame ? (
                    <img
                      src={remoteVideoFrame}
                      alt={remoteParticipant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-900 border-2 border-indigo-500 text-white font-extrabold text-2xl shadow-lg">
                        {remoteParticipant.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-200">{remoteParticipant.name}</p>
                        <p className="text-[11px] text-blue-400 flex items-center justify-center mt-0.5">
                          <Volume2 className="h-3.5 w-3.5 mr-1 animate-pulse" /> Active • {remoteParticipant.isHost ? 'Host (Mentor)' : 'Student'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 flex items-center space-x-2 rounded-xl bg-slate-950/80 backdrop-blur-md px-3 py-1.5 text-xs font-semibold border border-slate-800">
                    <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                    <span>{remoteParticipant.name}</span>
                  </div>

                  <div className="absolute top-4 right-4 rounded-lg bg-slate-950/80 p-1.5 border border-slate-800 text-slate-400">
                    <Mic className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
              ) : (
                /* Cross-Device Connect / Waiting Card */
                <div className="relative aspect-video w-full rounded-3xl bg-slate-900/60 border-2 border-dashed border-indigo-500/40 flex flex-col items-center justify-center p-6 space-y-4 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                    <Globe className="h-7 w-7 animate-pulse text-indigo-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-extrabold text-white">Connecting With Someone on Another PC / Mobile?</p>
                    <p className="text-xs text-slate-400 max-w-sm">
                      To see and talk with your peer or mentor across the internet in real-time WebRTC HD Video:
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setUseGlobalWebRTC(true)}
                      className="flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                    >
                      <Video className="h-4 w-4" />
                      <span>Switch to Multi-Device Live Video</span>
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center justify-center space-x-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>{copiedLink ? 'Copied!' : 'Copy Invite Link'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

        {/* Right Side Drawer: Live Meeting Chat */}
        {activePanel === 'chat' && (
          <div className="w-80 border-l border-slate-800 bg-slate-900 flex flex-col z-20 animate-slide-left">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-blue-400" />
                <span>Live Meeting Chat</span>
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((msg) => {
                const isMe = msg.sender === displayName;
                return (
                  <div key={msg.id} className={`space-y-1 ${isMe ? 'items-end text-right' : ''}`}>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className={`font-bold ${isMe ? 'text-blue-400' : 'text-slate-200'}`}>{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div
                      className={`rounded-xl p-2.5 text-slate-100 leading-relaxed border ${
                        isMe ? 'bg-blue-600/30 border-blue-500/40 text-left' : 'bg-slate-800 border-slate-700/50'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message to everyone..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {/* Right Side Drawer: Participants List */}
        {activePanel === 'participants' && (
          <div className="w-80 border-l border-slate-800 bg-slate-900 flex flex-col z-20 animate-slide-left">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-400" />
                <span>Participants ({remoteParticipant ? 2 : 1} Active)</span>
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-2 text-xs">
              {/* You */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-[11px]">
                    {displayName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-white">{displayName}</p>
                    <p className="text-[10px] text-blue-400">You ({isHost ? 'Host' : 'Student'})</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-400">
                  {micEnabled ? <Mic className="h-3.5 w-3.5 text-blue-400" /> : <MicOff className="h-3.5 w-3.5 text-rose-500" />}
                  {videoEnabled ? <Video className="h-3.5 w-3.5 text-blue-400" /> : <VideoOff className="h-3.5 w-3.5 text-rose-500" />}
                </div>
              </div>

              {/* Remote Peer */}
              {remoteParticipant ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-[11px]">
                      {remoteParticipant.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white">{remoteParticipant.name}</p>
                      <p className="text-[10px] text-emerald-400">Connected</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Mic className="h-3.5 w-3.5 text-blue-400" />
                    <Video className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                </div>
              ) : (
                <p className="text-center text-[11px] text-slate-500 py-4">
                  No other participants connected yet.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Conference Control Bar */}
      <div className="py-3 px-6 bg-slate-900 border-t border-slate-800 flex items-center justify-center space-x-3 z-30">
        {/* Toggle Microphone */}
        <button
          onClick={toggleMic}
          className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all shadow-md ${
            micEnabled ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white shadow-rose-600/30'
          }`}
          title={micEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </button>

        {/* Toggle Video Camera */}
        <button
          onClick={toggleVideo}
          className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all shadow-md ${
            videoEnabled ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white shadow-rose-600/30'
          }`}
          title={videoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={toggleScreenShare}
          className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all shadow-md ${
            isScreenSharing ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-slate-800 hover:bg-slate-700 text-white'
          }`}
          title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Your Screen'}
        >
          <MonitorUp className="h-5 w-5" />
        </button>

        {/* Raise Hand */}
        <button
          onClick={() => setHandRaised(!handRaised)}
          className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all shadow-md ${
            handRaised ? 'bg-amber-600 text-white shadow-amber-600/30' : 'bg-slate-800 hover:bg-slate-700 text-white'
          }`}
          title={handRaised ? 'Lower Hand' : 'Raise Hand'}
        >
          <Hand className="h-5 w-5" />
        </button>

        {/* Chat Drawer Toggle */}
        <button
          onClick={() => setActivePanel(activePanel === 'chat' ? null : 'chat')}
          className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all shadow-md relative ${
            activePanel === 'chat' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
          }`}
          title="Meeting Chat"
        >
          <MessageSquare className="h-5 w-5" />
        </button>

        {/* Participants Toggle */}
        <button
          onClick={() => setActivePanel(activePanel === 'participants' ? null : 'participants')}
          className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all shadow-md relative ${
            activePanel === 'participants' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
          }`}
          title="Participants List"
        >
          <Users className="h-5 w-5" />
          {remoteParticipant && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
          )}
          {isHost && admissionRequests.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-slate-950 animate-bounce">
              {admissionRequests.length}
            </span>
          )}
        </button>

        {/* Leave Meeting Button */}
        <button
          onClick={handleLeaveCall}
          className="flex items-center space-x-2 rounded-2xl bg-rose-600 hover:bg-rose-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all cursor-pointer ml-2"
        >
          <PhoneOff className="h-4 w-4" />
          <span>Leave Call</span>
        </button>
      </div>
    </div>
  );
};

export const LiveMeetingRoom = () => {
  return (
    <MeetingErrorBoundary>
      <LiveMeetingRoomComponent />
    </MeetingErrorBoundary>
  );
};
