import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Users, Link as LinkIcon, Copy, MessageCircle, Check } from 'lucide-react';
import Header from './Header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner';

interface GroupOrderPageProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function GroupOrderPage({ cartCount, onCartClick }: GroupOrderPageProps) {
  const [groupName, setGroupName] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [members, setMembers] = useState<Array<any>>([
    { id: 'm_you', name: 'You', initial: 'Y', items: 2, itemsDetails: [{ id: 'p1', name: 'Paneer Butter Masala', price: 180 }] },
  ]);
  const [activityLog, setActivityLog] = useState<Array<any>>([]);
  const [guestName, setGuestName] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<any>>([]);
  const [chatInput, setChatInput] = useState('');
  const [filters, setFilters] = useState<{ [k: string]: boolean }>({ veg: false, nonveg: false, vegan: false, spicy: false });
  const [suggestions] = useState([
    { id: 's1', name: 'Chicken Biryani', price: 250 },
    { id: 's2', name: 'Gulab Jamun', price: 120 },
    { id: 's3', name: 'Protein Power Bowl', price: 320 },
  ]);
  const [lockSeconds, setLockSeconds] = useState(15 * 60); // 15 minutes timer
  const lockInterval = useRef<any>(null);

  useEffect(() => {
    if (lockInterval.current) clearInterval(lockInterval.current);
    lockInterval.current = setInterval(() => {
      setLockSeconds((s) => {
        if (s <= 1) {
          clearInterval(lockInterval.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(lockInterval.current);
  }, []);

  const logActivity = (text: string) => {
    const entry = { id: Date.now().toString(), text, time: new Date().toLocaleTimeString() };
    setActivityLog((a) => [entry, ...a].slice(0, 50));
  };

  const generateInviteLink = () => {
    if (!groupName) {
      toast.error('Please enter a group name');
      return;
    }
    const link = `https://yummport.app/join/${Math.random().toString(36).slice(2, 9)}`;
    setInviteLink(link);
    toast.success('Invite link generated! 🔗');
    logActivity(`Invite link generated for "${groupName}"`);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success('Link copied to clipboard!');
    } catch (e) {
      toast.error('Could not copy link');
    }
  };

  const addGuest = () => {
    if (!guestName.trim()) return toast.error('Enter a name to join');
    const id = 'g_' + Math.random().toString(36).slice(2, 8);
    const newMember = { id, name: guestName.trim(), initial: guestName.trim().charAt(0).toUpperCase(), items: 0, itemsDetails: [] };
    setMembers((m) => [...m, newMember]);
    setGuestName('');
    logActivity(`${newMember.name} joined the group`);
    toast.success(`${newMember.name} joined`);
  };

  const addItemToMember = (memberId: string, item: any) => {
    setMembers((m) => m.map(mem => {
      if (mem.id !== memberId) return mem;
      const updated = { ...mem, items: (mem.items || 0) + 1, itemsDetails: [...(mem.itemsDetails||[]), item] };
      return updated;
    }));
    const member = members.find(x => x.id === memberId);
    logActivity(`${member ? member.name : 'Someone'} added ${item.name}`);
    toast.success(`${item.name} added to ${member ? member.name : 'cart'}`);
  };

  const removeItemFromMember = (memberId: string, itemIndex: number) => {
    setMembers((m) => m.map(mem => {
      if (mem.id !== memberId) return mem;
      const itemsCopy = [...(mem.itemsDetails||[])];
      const removed = itemsCopy.splice(itemIndex, 1)[0];
      const updated = { ...mem, items: Math.max(0, (mem.items||0) - 1), itemsDetails: itemsCopy };
      logActivity(`${mem.name} removed ${removed?.name || 'an item'}`);
      return updated;
    }));
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const msg = { id: Date.now().toString(), from: 'You', text: chatInput.trim(), time: new Date().toLocaleTimeString() };
    setMessages((s) => [...s, msg]);
    setChatInput('');
  };

  const toggleFilter = (key: string) => {
    setFilters((f) => ({ ...f, [key]: !f[key] }));
  };

  const totalAmount = members.reduce((sum, mem) => sum + (mem.itemsDetails || []).reduce((s:any,it:any)=> s + (it.price||0), 0), 0);
  const splitPerPerson = members.length ? (totalAmount / members.length) : 0;

  return (
    <div className="min-h-screen bg-[#FFF3E6]">
      <Header cartCount={cartCount} onCartClick={onCartClick} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* HERO / CREATE */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#FF5200] to-[#FF7A33] rounded-full mb-4 shadow-lg">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl text-[#1C1C1C] mb-2">Start a Group Order 🍕</h1>
            <p className="text-[#5E5E5E]">Invite friends, collaborate in real-time and split the bill</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Create & Invite */}
            <Card className="p-6 bg-gradient-to-br from-[#FFF3E6] to-white border-0 shadow-lg">
              <h2 className="text-2xl text-[#1C1C1C] mb-4">Create Group</h2>
              <label className="text-sm text-[#1C1C1C] mb-2 block">Group / Event Name</label>
              <Input value={groupName} onChange={(e)=> setGroupName(e.target.value)} placeholder="e.g., Team Lunch Friday" className="h-12 border-2 border-[#FFF3E6] focus:border-[#FF5200] mb-4" />
              <Button onClick={generateInviteLink} className="w-full h-12 bg-gradient-to-r from-[#FF5200] to-[#FF7A33] mb-4"> <LinkIcon className="w-5 h-5 mr-2"/> Generate Invite Link</Button>

              {inviteLink && (
                <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="p-3 bg-white rounded-lg border-2 border-[#FF5200]/20 mb-4">
                  <p className="text-sm text-[#5E5E5E] mb-2">Shareable Link</p>
                  <div className="flex gap-2">
                    <Input value={inviteLink} readOnly className="flex-1 text-sm" />
                    <Button onClick={copyLink} size="icon" variant="outline" className="border-[#FF5200] text-[#FF5200]"><Copy className="w-4 h-4"/></Button>
                  </div>
                </motion.div>
              )}

              <div className="mt-2">
                <label className="text-sm text-[#1C1C1C] mb-2 block">Guest join</label>
                <div className="flex gap-2">
                  <Input placeholder="Guest name" value={guestName} onChange={(e)=> setGuestName(e.target.value)} className="h-10" />
                  <Button onClick={addGuest} className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33]">Join</Button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm text-[#1C1C1C] mb-2">Dietary Filters</h3>
                <div className="flex gap-2 flex-wrap">
                  {['veg','nonveg','vegan','spicy'].map((f)=> (
                    <button key={f} onClick={()=> toggleFilter(f)} className={`px-3 py-1 rounded-full text-sm ${filters[f] ? 'bg-gradient-to-r from-[#FF5200] to-[#FF7A33] text-white' : 'bg-white text-[#FF5200] border border-[#FF5200]/20'}`}>
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm text-[#1C1C1C] mb-2">Smart Suggestions</h3>
                <div className="flex gap-3 overflow-x-auto py-2">
                  {suggestions.map(s => (
                    <Card key={s.id} className="min-w-[160px] p-3 bg-white border-0 shadow-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm text-[#1C1C1C]">{s.name}</h4>
                          <p className="text-sm text-[#5E5E5E]">₹{s.price}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33]" onClick={()=> addItemToMember(members[0].id, s)}>Add</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>

            {/* Center: Members & Activity */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-gradient-to-br from-white to-[#FFF3E6] border-0 shadow-lg mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl text-[#1C1C1C]">Group Members</h2>
                  <div className="px-3 py-1 bg-[#FF5200] text-white rounded-full text-sm">{members.length} members</div>
                </div>

                <div className="space-y-3">
                  {members.map((member, idx) => (
                    <motion.div key={member.id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <Avatar className="w-12 h-12 bg-gradient-to-br from-[#FF5200] to-[#FF7A33]">
                        <AvatarFallback className="text-white">{member.initial}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[#1C1C1C]">{member.name}</h3>
                          <div className="text-sm text-[#5E5E5E]">{member.items} items</div>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="outline" className="border-[#FF5200] text-[#FF5200]" onClick={()=> setChatOpen(true)}><MessageCircle className="w-4 h-4 mr-2"/>Chat</Button>
                          <Button size="sm" className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33]" onClick={()=> addItemToMember(member.id, { id: 'p_stub', name: 'Sample Dish', price: 99 })}>+ Add</Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              <Card className="p-4 bg-white border-0 shadow-lg">
                <h3 className="text-sm text-[#1C1C1C] mb-2">Activity Log</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {activityLog.map((a) => (
                    <motion.div key={a.id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} className="p-3 bg-white rounded-md border-l-4 border-[#FF5200]/20 shadow-sm">
                      <div className="text-sm text-[#1C1C1C]">{a.text}</div>
                      <div className="text-xs text-[#5E5E5E] mt-1">{a.time}</div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right: Chat & Review */}
            <div className="lg:col-span-1">
              <Card className="p-4 bg-white border-0 shadow-lg mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg text-[#1C1C1C]">Group Chat</h3>
                  <div className="text-sm text-[#5E5E5E]">Live</div>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-3 mb-3">
                  {messages.map(m => (
                    <motion.div key={m.id} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} className={`p-3 rounded-md ${m.from === 'You' ? 'bg-gradient-to-r from-[#FF5200] to-[#FF7A33] text-white' : 'bg-white text-[#1C1C1C]'} shadow-sm`}>
                      <div className="text-sm font-medium">{m.from}</div>
                      <div className="text-sm mt-1">{m.text}</div>
                      <div className="text-xs text-white/80 mt-1">{m.time}</div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={chatInput} onChange={(e)=> setChatInput(e.target.value)} placeholder="Type a message" className="h-10 border-2 focus:border-[#FF5200]" />
                  <Button onClick={sendMessage} className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33]">Send</Button>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-r from-[#FFF3E6] to-white border-0 shadow-lg">
                <h3 className="text-sm text-[#1C1C1C] mb-2">Order Lock</h3>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="44" stroke="#FFE9DC" strokeWidth="8" fill="none" />
                      <circle cx="50" cy="50" r="44" stroke="url(#g)" strokeWidth="8" strokeLinecap="round" fill="none" strokeDasharray={`${2*Math.PI*44}`} strokeDashoffset={`${2*Math.PI*44*(1 - (lockSeconds/(15*60)))}`} transform="rotate(-90 50 50)" />
                      <defs>
                        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FF5200" />
                          <stop offset="100%" stopColor="#FF7A33" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl font-bold text-[#1C1C1C]">{Math.floor(lockSeconds/60)}:{String(lockSeconds%60).padStart(2,'0')}</div>
                        <div className="text-xs text-[#5E5E5E]">to lock</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[#1C1C1C]">Order locks in</p>
                    <p className="text-sm text-[#5E5E5E]">Once locked, no further edits</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-r from-[#FF5200] to-[#FF7A33] border-0 shadow-xl text-white mt-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg">Ready to Place Order?</h3>
                    <p className="text-sm opacity-90">Total: ₹{totalAmount} • Per person: ₹{splitPerPerson.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="bg-white text-[#FF5200] border-0">Split Bill</Button>
                    <Button className="bg-green-600">Confirm & Pay Together</Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Final Review */}
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="mt-8">
            <h2 className="text-2xl text-[#1C1C1C] mb-4">Final Review</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {members.map(mem => (
                <Card key={mem.id} className="p-4 bg-white border-0 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 bg-gradient-to-br from-[#FF5200] to-[#FF7A33]"><AvatarFallback className="text-white">{mem.initial}</AvatarFallback></Avatar>
                      <div>
                        <div className="text-sm text-[#1C1C1C]">{mem.name}</div>
                        <div className="text-xs text-[#5E5E5E]">{mem.items} items</div>
                      </div>
                    </div>
                    <div className="text-sm text-[#FF5200] font-bold">₹{(mem.itemsDetails||[]).reduce((s:any,i:any)=> s+(i.price||0),0)}</div>
                  </div>
                  <div className="space-y-2">
                    {(mem.itemsDetails||[]).map((it:any, idx:number) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-[#FFF3E6] rounded">
                        <div>
                          <div className="text-sm text-[#1C1C1C]">{it.name}</div>
                          <div className="text-xs text-[#5E5E5E]">₹{it.price}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={()=> removeItemFromMember(mem.id, idx)} className="text-sm text-red-500">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
