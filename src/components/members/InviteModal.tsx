import { Button } from '@/components/ui/button';
import { sendInvitation } from '@/lib/api/client';
import { ChevronDown, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

type Role = 'member' | 'admin';
type Recipient = { email: string; role: Role };

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
}

export default function InviteModal({ open, onClose }: InviteModalProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([
    { email: '', role: 'member' },
  ]);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const filledCount = recipients.filter((r) => r.email.trim()).length;

  function handleClose() {
    setRecipients([{ email: '', role: 'member' }]);
    onClose();
  }

  function updateRecipient(
    index: number,
    field: keyof Recipient,
    value: string,
  ) {
    setRecipients((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    );
  }

  function removeRecipient(index: number) {
    setRecipients((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev,
    );
  }

  function addRecipient() {
    if (recipients.length >= 10) return;
    setRecipients((prev) => [...prev, { email: '', role: 'member' }]);
  }

  function onSubmit() {
    setLoading(true);
    sendInvitation(recipients)
      .then(() => handleClose())
      .catch((err) => console.error('Failed to send invitations:', err))
      .finally(() => setLoading(false));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Invite people
            </h3>
            <p className="mt-0.5 text-[11px] text-gray-400 font-mono">
              POST /invitations · <span>{`{ email, role }`}</span> per recipient
            </p>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Recipients */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700">
              Recipients
            </label>
            <div className="flex flex-col gap-2">
              {recipients.map((r, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <input
                    type="email"
                    className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 font-mono text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    placeholder="name@company.com"
                    value={r.email}
                    onChange={(e) =>
                      updateRecipient(i, 'email', e.target.value)
                    }
                  />
                  <div className="relative shrink-0 w-25">
                    <select
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-2.5 pr-6 font-mono text-[11.5px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 cursor-pointer"
                      value={r.role}
                      onChange={(e) =>
                        updateRecipient(i, 'role', e.target.value as Role)
                      }
                    >
                      <option value="member">MEMBER</option>
                      <option value="admin">ADMIN</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeRecipient(i)}
                    title="Remove"
                    className="shrink-0 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
            {recipients.length < 10 && (
              <button
                onClick={addRecipient}
                className="mt-1 flex items-center gap-1 self-start text-[12px] text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Plus className="size-3" /> Add another
              </button>
            )}
            <p className="text-[11px] text-gray-400">
              Up to 10 per batch · only OWNER can promote to OWNER later.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <span className="text-[11px] text-gray-400 font-mono">
            Fires <span className="font-semibold">member.invited</span> per
            recipient
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={filledCount === 0 || loading}
              onClick={onSubmit}
            >
              {filledCount > 0
                ? `Send ${filledCount} invitation${filledCount !== 1 ? 's' : ''}`
                : 'Send invitation'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
