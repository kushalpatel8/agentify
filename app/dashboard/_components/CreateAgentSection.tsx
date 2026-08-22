'use client'
import { Button } from '@/components/ui/button'
import { Loader2Icon, Plus, Lock, Zap, Clock, ArrowRight } from 'lucide-react'
import React, { useContext, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'
import { UserDetailContext } from '@/context/UserDetailContext'
import { toast } from 'sonner'

const FREE_AGENT_LIMIT = 2;

/* ─── Upgrade / Limit Modal ─────────────────────────────────────────────── */
function LimitReachedModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const router = useRouter();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <div className="flex flex-col items-center text-center gap-0 overflow-hidden rounded-xl">

                    {/* Gradient header */}
                    <div
                        className="w-full flex flex-col items-center justify-center gap-3 py-8 px-6"
                        style={{
                            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
                        }}
                    >
                        {/* Lock icon with glow */}
                        <div
                            className="flex items-center justify-center w-16 h-16 rounded-full mb-1"
                            style={{
                                background: 'rgba(139,92,246,0.25)',
                                boxShadow: '0 0 30px rgba(139,92,246,0.5)',
                                border: '1.5px solid rgba(167,139,250,0.4)',
                            }}
                        >
                            <Lock className="w-7 h-7 text-violet-300" />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">
                            Agent Limit Reached
                        </h2>
                        <p className="text-sm text-violet-200 max-w-xs leading-relaxed">
                            You've reached your <span className="font-semibold text-white">free plan limits</span>. 
                            Choose how you'd like to continue.
                        </p>
                    </div>

                    {/* Options */}
                    <div className="w-full flex flex-col gap-3 p-6">

                        {/* Option 1 — Wait */}
                        <div
                            className="flex items-start gap-4 p-4 rounded-xl border transition-all"
                            style={{
                                borderColor: 'rgba(99,102,241,0.25)',
                                background: 'rgba(99,102,241,0.05)',
                            }}
                        >
                            <div
                                className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg"
                                style={{ background: 'rgba(99,102,241,0.15)' }}
                            >
                                <Clock className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-semibold text-sm text-foreground">Wait for refill</p>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                    Your <span className="font-medium text-indigo-400">5,000 tokens</span> automatically 
                                    restore in <span className="font-medium text-indigo-400">5 days</span>. 
                                    No action needed.
                                </p>
                                {/* Refill progress bar */}
                                <div className="mt-2.5 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: '0%',
                                            background: 'linear-gradient(90deg, #6366f1, #818cf8)',
                                            transition: 'width 1s ease',
                                        }}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1">0 / 5,000 tokens available</p>
                            </div>
                        </div>

                        {/* Option 2 — Upgrade (CTA) */}
                        <button
                            onClick={() => {
                                onClose();
                                router.push('/dashboard/pricing');
                            }}
                            className="relative w-full flex items-center gap-4 p-4 rounded-xl border text-left overflow-hidden group transition-all cursor-pointer"
                            style={{
                                borderColor: 'rgba(234,179,8,0.35)',
                                background: 'linear-gradient(135deg, rgba(234,179,8,0.08) 0%, rgba(251,191,36,0.05) 100%)',
                            }}
                        >
                            {/* Shimmer */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    background: 'linear-gradient(105deg, transparent 40%, rgba(251,191,36,0.08) 50%, transparent 60%)',
                                }}
                            />
                            <div
                                className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg"
                                style={{ background: 'rgba(234,179,8,0.15)' }}
                            >
                                <Zap className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-sm text-foreground">Upgrade to Unlimited</p>
                                    <span
                                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                                        style={{ background: 'rgba(234,179,8,0.2)', color: '#ca8a04' }}
                                    >
                                        Recommended
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                    Unlimited agents, priority support, and advanced tools — no limits, ever.
                                </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-yellow-500 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                        </button>

                    </div>

                    {/* Footer */}
                    <div className="w-full px-6 pb-5">
                        <button
                            onClick={onClose}
                            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                        >
                            Maybe later
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
function CreateAgentSection() {
    const [openDialog, setOpenDialog] = useState(false);
    const [openLimitModal, setOpenLimitModal] = useState(false);
    const [agentName, setAgentName] = useState<string>();
    const router = useRouter();
    const [loader, setloader] = useState(false);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    // Fetch the user's current agent count
    const agentList = useQuery(
        api.agent.GetUsersAgents,
        userDetail?._id ? { userId: userDetail._id } : 'skip'
    );

    const isSubscribed = !!userDetail?.subscription;
    const isAgentListLoading = agentList === undefined;
    const tokenCount = userDetail?.token ?? 0;
    const agentsRemaining = Math.max(0, Math.floor(tokenCount / 2500));

    const handleCreateClick = () => {
        // Prevent action if still loading user data
        if (userDetail === undefined) return;

        if (!isSubscribed && agentsRemaining <= 0) {
            setOpenLimitModal(true);
            return;
        }
        setOpenDialog(true);
    };

    const CreateAgent = async () => {
        if (!userDetail?._id) {
            console.error('User not loaded yet, cannot create agent');
            return;
        }
        setloader(true);
        try {
            const agentId = uuidv4();
            const res = await fetch('/api/create-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentId,
                    name: agentName ?? '',
                    userId: userDetail._id,
                    isSubscribed: !!userDetail?.subscription,
                }),
            });

            if (res.status === 429) {
                setOpenDialog(false);
                setOpenLimitModal(true);
                return;
            }

            if (!res.ok) {
                toast.error('Failed to create agent. Please try again.');
                return;
            }

            const data = await res.json();

            // Sync remaining token count into context so sidebar updates instantly
            if (typeof data.remaining === 'number') {
                setUserDetail((prev: any) => ({ ...prev, token: data.remaining }));
            }

            setOpenDialog(false);
            router.push('/agent-builder/' + agentId);
        } catch (error) {
            console.error('Failed to create agent:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setloader(false);
        }
    }

    return (
        <div className='space-y-2 flex flex-col justify-center items-center mt-24'>
            <h1 className='font-bold text-xl text-stone-900'>Create AI Agent</h1>
            <p className='text-lg text-stone-500'>Build a AI Agent workflow with custom logic and tools</p>

            {/* Remaining agents badge — only visible for free users */}
            {!isSubscribed && (
                isAgentListLoading ? (
                    // Loading skeleton while Convex fetches agent count
                    <div className='h-7 w-48 rounded-full animate-pulse bg-gray-200 dark:bg-gray-700' />
                ) : (
                    <div
                        className='flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border'
                        style={{
                            backgroundColor: agentsRemaining === 0 ? 'rgba(234,179,8,0.1)' : '#FEF3C7',
                            borderColor: agentsRemaining === 0 ? 'rgba(234,179,8,0.4)' : '#FDE68A',
                            color: agentsRemaining === 0 ? '#ca8a04' : '#B45309',
                        }}
                    >
                        <span
                            className='inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold'
                            style={{
                                backgroundColor: agentsRemaining === 0 ? '#ca8a04' : '#F59E0B',
                                color: '#1C1917',
                            }}
                        >
                            {agentsRemaining}
                        </span>
                        <span className='font-medium'>
                            {agentsRemaining === 1 ? 'agent' : 'agents'} remaining on free plan
                        </span>
                    </div>
                )
            )}

            {/* Agent name dialog */}
            <Button size={'lg'} onClick={handleCreateClick} className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium"><Plus /> Create </Button>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter Agents Name</DialogTitle>
                        <DialogDescription>
                            <Input placeholder='Agent Name' onChange={(event) => setAgentName(event.target.value)} />
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose>
                            <Button variant={'ghost'}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={() => CreateAgent()} disabled={loader} className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium">
                            {loader && <Loader2Icon className='animate-spin' />}
                            Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Limit reached modal */}
            <LimitReachedModal
                open={openLimitModal}
                onClose={() => setOpenLimitModal(false)}
            />
        </div>
    )
}

export default CreateAgentSection

