import { useState, useRef } from "react";
import {
  User,
  AtSign,
  Mail,
  Camera,
  Pencil,
  Save,
  X,
  Lock,
  Globe,
  CheckCircle2,
  Loader2,
  BadgeCheck,
} from "lucide-react";
import useAuth from "../../context/auth/UseAuth";
import userApi from "../../../api/user.api";

const SectionCard = ({ title, desc, children }) => (
  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6">
    <div className="mb-4">
      <h2 className="text-base sm:text-lg font-semibold text-white">{title}</h2>
      {desc && <p className="text-xs sm:text-sm text-zinc-500 mt-1">{desc}</p>}
    </div>
    {children}
  </div>
);

const ActionButtons = ({ onCancel, onSave, saving }) => (
  <div className="flex flex-col sm:flex-row sm:justify-end gap-2.5 mt-5">
    <button
      onClick={onCancel}
      disabled={saving}
      className="order-2 sm:order-1 flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 active:bg-zinc-900 sm:hover:bg-zinc-900 transition disabled:opacity-50"
    >
      <X size={14} />
      Cancel
    </button>
    <button
      onClick={onSave}
      disabled={saving}
      className="order-1 sm:order-2 flex items-center justify-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl bg-emerald-500 text-black active:bg-emerald-400 sm:hover:bg-emerald-400 transition disabled:opacity-60"
    >
      {saving ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Save size={14} />
      )}
      {saving ? "Saving..." : "Save Changes"}
    </button>
  </div>
);

const SavedNote = ({ show }) =>
  show ? (
    <p className="mt-3 text-sm text-emerald-400 flex items-center gap-1.5">
      <CheckCircle2 size={15} />
      Saved successfully.
    </p>
  ) : null;

export default function ProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(
    user || {
      fullName: "Prince Kumar",
      username: "prince",
      email: "prince@example.com",
      avatar: "https://i.pravatar.cc/150?img=12",
      visibility: "public",
    },
  );

  /* ---------- Name & Username ---------- */
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState({
    fullName: profile.fullName,
    username: profile.username,
  });
  const [savingName, setSavingName] = useState(false);
  const [savedName, setSavedName] = useState(false);

  const startEditName = () => {
    setNameDraft({ fullName: profile.fullName, username: profile.username });
    setEditingName(true);
    setSavedName(false);
  };
  const cancelName = () => setEditingName(false);

  const saveName = async () => {
    setSavingName(true);
    try {
      const payload = {
        username: nameDraft.username,
        fullName: nameDraft.fullName,
      };
      const res = await userApi.changeNameDraft(payload);
      console.log(res.data);
      setEditingName(false);
      setSavedName(true);
      setTimeout(() => setSavedName(false), 2000);
    } finally {
      setSavingName(false);
    }
  };

  /* ---------- Avatar ---------- */
  const avatarInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [savedAvatar, setSavedAvatar] = useState(false);
  const [avatar, setavatar] = useState(null);

  const handleAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
    setavatar(file);
  };
  const cancelAvatar = () => {
    setAvatarPreview(null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };
  const saveAvatar = async () => {
    if (!avatar) return;

    setSavingAvatar(true);

    try {
      const res = await userApi.saveAvatar(avatar);

      console.log(res.data);

      setAvatarPreview(null);
      setSavedAvatar(true);

      setTimeout(() => {
        setSavedAvatar(false);
      }, 2000);
    } catch (error) {
      console.error(error.response);

      alert(error.response?.data?.message || "Failed to update avatar.");
    } finally {
      setSavingAvatar(false);
    }
  };

  /* ---------- Email ---------- */
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailDraft, setEmailDraft] = useState(profile.email);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savedEmail, setSavedEmail] = useState(false);
  const [emailError, setEmailError] = useState("");

  const startEditEmail = () => {
    setEmailDraft(profile.email);
    setEditingEmail(true);
    setSavedEmail(false);
    setEmailError("");
  };
  const cancelEmail = () => setEditingEmail(false);
  const saveEmail = async () => {
    if (!/^\S+@\S+\.\S+$/.test(emailDraft)) {
      setEmailError("Enter a valid email address.");
      return;
    }
    setEmailError("");
    setSavingEmail(true);
    try {
      await new Promise((res) => setTimeout(res, 800)); // TODO: real API
      setProfile((p) => ({ ...p, email: emailDraft }));
      setEditingEmail(false);
      setSavedEmail(true);
      setTimeout(() => setSavedEmail(false), 2000);
    } catch (error) {
      console.log(error.response);
    } finally {
      setSavingEmail(false);
    }
  };

  /* ---------- Visibility ---------- */
  const [savingVisibility, setSavingVisibility] = useState(false);
  const [savedVisibility, setSavedVisibility] = useState(false);

  const changeVisibility = async (value) => {
    if (value === profile.visibility) return;
    setSavingVisibility(true);
    try {
      await new Promise((res) => setTimeout(res, 600)); // TODO: real API
      setProfile((p) => ({ ...p, visibility: value }));
      setSavedVisibility(true);
      setTimeout(() => setSavedVisibility(false), 2000);
    } finally {
      setSavingVisibility(false);
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Profile</h1>
        <p className="text-zinc-500 text-xs sm:text-sm mt-1">
          Manage your personal information and account preferences.
        </p>
      </div>

      {/* ---------- Avatar Section ---------- */}
      <SectionCard
        title="Profile Picture"
        desc="Used across your profile and account."
      >
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-2 ring-zinc-800 overflow-hidden bg-zinc-800 shrink-0">
            <img
              src={
                avatarPreview ||
                profile.avatar?.url ||
                "https://i.pinimg.com/1200x/6e/59/95/6e599501252c23bcf02658617b29c894.jpg"
              }
              alt={profile.fullName}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 active:opacity-100 sm:hover:opacity-100 transition"
            >
              <Camera size={18} className="text-white" />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarPick}
              className="hidden"
            />
          </div>

          <div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-zinc-800 text-zinc-300 active:bg-zinc-900 sm:hover:bg-zinc-900 transition"
            >
              <Camera size={14} />
              Choose Image
            </button>
            <p className="text-xs text-zinc-500 mt-2">JPG or PNG. Max 5MB.</p>
          </div>
        </div>

        {avatarPreview && (
          <ActionButtons
            onCancel={cancelAvatar}
            onSave={saveAvatar}
            saving={savingAvatar}
          />
        )}
        <SavedNote show={savedAvatar} />
      </SectionCard>

      {/* ---------- Name & Username Section ---------- */}
      <SectionCard title="Name & Username">
        {!editingName ? (
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-white">
                <User size={15} className="text-zinc-500" />
                {profile.fullName}
                <BadgeCheck size={14} className="text-emerald-400" />
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white">
                <AtSign size={15} className="text-zinc-500" />@
                {profile.username}
              </div>
            </div>
            <button
              onClick={startEditName}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl border border-zinc-800 text-zinc-300 active:bg-zinc-900 sm:hover:bg-zinc-900 transition shrink-0"
            >
              <Pencil size={13} />
              Edit
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm text-zinc-500 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  value={nameDraft.fullName}
                  onChange={(e) =>
                    setNameDraft((d) => ({ ...d, fullName: e.target.value }))
                  }
                  placeholder="Your full name"
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-zinc-500 mb-1.5">
                Username
              </label>
              <div className="relative">
                <AtSign
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  value={nameDraft.username}
                  onChange={(e) =>
                    setNameDraft((d) => ({ ...d, username: e.target.value }))
                  }
                  placeholder="username"
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60 transition"
                />
              </div>
            </div>
            <ActionButtons
              onCancel={cancelName}
              onSave={saveName}
              saving={savingName}
            />
          </div>
        )}
        <SavedNote show={savedName} />
      </SectionCard>

      {/* ---------- Email Section ---------- */}
      <SectionCard title="Email Address">
        {!editingEmail ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-sm text-white">
              <Mail size={15} className="text-zinc-500" />
              {profile.email}
            </div>
            <button
              onClick={startEditEmail}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl border border-zinc-800 text-zinc-300 active:bg-zinc-900 sm:hover:bg-zinc-900 transition shrink-0"
            >
              <Pencil size={13} />
              Edit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="email"
                value={emailDraft}
                onChange={(e) => setEmailDraft(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60 transition"
              />
            </div>
            {emailError && <p className="text-xs text-red-400">{emailError}</p>}
            <ActionButtons
              onCancel={cancelEmail}
              onSave={saveEmail}
              saving={savingEmail}
            />
          </div>
        )}
        <SavedNote show={savedEmail} />
      </SectionCard>

      {/* ---------- Visibility Section ---------- */}
      <SectionCard
        title="Account Visibility"
        desc="Control who can see your profile."
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => changeVisibility("public")}
            disabled={savingVisibility}
            className={`flex-1 flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition ${
              profile.visibility === "public"
                ? "border-emerald-500/60 bg-emerald-500/10"
                : "border-zinc-800 active:bg-zinc-900 sm:hover:bg-zinc-900"
            }`}
          >
            <Globe
              size={18}
              className={
                profile.isPrivate ? "text-emerald-400" : "text-zinc-500"
              }
            />
            <div>
              <p className="text-sm font-medium text-white">Public</p>
              <p className="text-xs text-zinc-500">
                Anyone can view your profile.
              </p>
            </div>
          </button>

          <button
            onClick={() => changeVisibility("private")}
            disabled={savingVisibility}
            className={`flex-1 flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition ${
              profile.isPrivate
                ? "border-emerald-500/60 bg-emerald-500/10"
                : "border-zinc-800 active:bg-zinc-900 sm:hover:bg-zinc-900"
            }`}
          >
            <Lock
              size={18}
              className={
                profile.isPrivate ? "text-emerald-400" : "text-zinc-500"
              }
            />
            <div>
              <p className="text-sm font-medium text-white">Private</p>
              <p className="text-xs text-zinc-500">
                Only you can view your profile.
              </p>
            </div>
          </button>
        </div>

        {savingVisibility && (
          <p className="mt-3 text-sm text-zinc-500 flex items-center gap-1.5">
            <Loader2 size={14} className="animate-spin" />
            Updating...
          </p>
        )}
        <SavedNote show={savedVisibility} />
      </SectionCard>
    </div>
  );
}
