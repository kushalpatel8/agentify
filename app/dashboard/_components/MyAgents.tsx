'use client';
import { UserDetailContext } from '@/context/UserDetailContext'
import { api } from '@/convex/_generated/api';
import { Agent } from '@/types/Agent';
import { useConvex, useMutation } from 'convex/react';
import { GitBranchPlus, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function MyAgents() {
    const { userDetail } = useContext(UserDetailContext);
    const [agentList, setAgentList] = useState<Agent[]>([]);
    const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
    const [deleting, setDeleting] = useState(false);
    const convex = useConvex();
    const deleteAgentMutation = useMutation(api.agent.DeleteAgent);

    useEffect(() => {
        userDetail && GetUserAgents();
    }, [userDetail])

    const GetUserAgents = async () => {
        const result = await convex.query(api.agent.GetUsersAgents, {
            userId: userDetail?._id
        });
        setAgentList(result);
    }

    const handleDeleteConfirm = async () => {
        if (!agentToDelete?._id) return;
        setDeleting(true);
        try {
            await deleteAgentMutation({ id: agentToDelete._id });
            setAgentList(prev => prev.filter(a => a._id !== agentToDelete._id));
            toast.success(`"${agentToDelete.name}" deleted successfully.`);
            setAgentToDelete(null);
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete agent. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className='w-full mt-5'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {agentList.map((agent, index) => (
                    <div key={index} className='relative group p-3 bg-[#FDF8EE] border border-amber-200/50 rounded-2xl shadow hover:shadow-md transition-shadow'>
                        {/* Delete button — appears on hover */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setAgentToDelete(agent);
                            }}
                            className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-stone-400 hover:text-red-500'
                            title='Delete agent'
                        >
                            <Trash2 className='w-4 h-4' />
                        </button>

                        {/* Card link */}
                        <Link href={'/agent-builder/' + agent.agentId} className='block'>
                            <div className="bg-amber-100 text-amber-800 p-2 h-8 w-8 rounded-sm flex items-center justify-center">
                                <GitBranchPlus className='w-full h-full' />
                            </div>
                            <h2 className='mt-3 font-medium pr-6 text-stone-900'>{agent.name}</h2>
                            <h2 className='text-sm text-stone-500 mt-2'>{moment(agent._creationTime).fromNow()}</h2>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Delete confirmation dialog */}
            <Dialog open={!!agentToDelete} onOpenChange={(open) => !open && setAgentToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <div className='flex flex-col items-center text-center gap-3 py-2'>
                            {/* Warning icon */}
                            <div
                                className='flex items-center justify-center w-14 h-14 rounded-full'
                                style={{
                                    background: 'rgba(239,68,68,0.1)',
                                    border: '1.5px solid rgba(239,68,68,0.25)',
                                }}
                            >
                                <AlertTriangle className='w-6 h-6 text-red-500' />
                            </div>
                            <DialogTitle className='text-lg font-bold'>Delete Agent?</DialogTitle>
                            <p className='text-sm text-muted-foreground max-w-xs leading-relaxed'>
                                You're about to permanently delete{' '}
                                <span className='font-semibold text-foreground'>"{agentToDelete?.name}"</span>.
                                All its configuration, nodes, and data will be lost. This cannot be undone.
                            </p>
                        </div>
                    </DialogHeader>
                    <DialogFooter className='flex gap-2 sm:gap-2'>
                        <Button
                            variant='ghost'
                            className='flex-1'
                            onClick={() => setAgentToDelete(null)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='destructive'
                            className='flex-1'
                            onClick={handleDeleteConfirm}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <><Loader2 className='w-4 h-4 animate-spin mr-2' /> Deleting…</>
                            ) : (
                                <><Trash2 className='w-4 h-4 mr-2' /> Delete Agent</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MyAgents