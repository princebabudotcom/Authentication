import React from "react";
import {
  ArrowLeft,
  Bell,
  Settings,
  Link as LinkIcon,
  MapPin,
  Calendar,
  Edit,
  Grid3X3,
  Bookmark,
  Heart,
  MessageSquare,
  Share2,
} from "lucide-react";

export default function ProfilePage() {
  const posts = [
    {
      id: 1,
      content:
        "Building a production-ready authentication system with MERN stack and modern UI.",
      likes: "1.2k",
      comments: "184",
    },
    {
      id: 2,
      content:
        "Dark minimal UI makes applications look cleaner and more professional.",
      likes: "860",
      comments: "92",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black/90 backdrop-blur">
        <div className="h-14 px-4 flex items-center justify-between max-w-5xl mx-auto">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition">
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <h1 className="text-sm font-semibold">Prince Babu</h1>

              <p className="text-xs text-zinc-500">24 Posts</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition">
              <Bell className="w-4 h-4" />
            </button>

            <button className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto">
        {/* Cover */}
        <div className="h-40 sm:h-52 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border-b border-zinc-900 relative">
          {/* Avatar */}
          <div className="absolute -bottom-14 left-4">
            <div className="h-28 w-28 rounded-[28px] bg-zinc-800 border-4 border-black flex items-center justify-center text-4xl font-bold">
              P
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-4 pt-16 pb-28">
          {/* Top Info */}
          <div className="flex items-start justify-between gap-4">
            {/* User Info */}
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Prince Babu
              </h2>

              <p className="text-zinc-500 text-sm mt-1">@princebabu</p>

              <p className="text-sm text-zinc-300 leading-relaxed mt-4 max-w-xl">
                MERN Stack Developer focused on building scalable
                production-ready web applications and modern UI systems.
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  India
                </div>

                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  gradebuilds.in
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined May 2026
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mt-5">
                <div>
                  <span className="font-semibold text-white">12.4k</span>{" "}
                  <span className="text-zinc-500 text-sm">Followers</span>
                </div>

                <div>
                  <span className="font-semibold text-white">248</span>{" "}
                  <span className="text-zinc-500 text-sm">Following</span>
                </div>
              </div>
            </div>

            {/* Edit */}
            <button className="h-11 px-5 rounded-xl bg-white text-black text-sm font-medium hover:opacity-90 transition flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto">
            <button className="h-11 px-5 rounded-xl bg-white text-black text-sm font-medium flex items-center gap-2 whitespace-nowrap">
              <Grid3X3 className="w-4 h-4" />
              Posts
            </button>

            <button className="h-11 px-5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition flex items-center gap-2 whitespace-nowrap">
              <Bookmark className="w-4 h-4" />
              Saved
            </button>
          </div>

          {/* Posts */}
          <div className="space-y-4 mt-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-3xl border border-zinc-900 bg-zinc-950 p-5"
              >
                {/* Post Top */}
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="h-11 w-11 rounded-2xl bg-zinc-800 flex items-center justify-center font-semibold">
                    P
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Prince Babu</h3>

                      <span className="text-sm text-zinc-500">@princebabu</span>
                    </div>

                    <p className="text-sm text-zinc-300 leading-relaxed mt-3">
                      {post.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-6 mt-5 text-zinc-500">
                      <button className="flex items-center gap-2 hover:text-white transition text-sm">
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </button>

                      <button className="flex items-center gap-2 hover:text-white transition text-sm">
                        <MessageSquare className="w-4 h-4" />
                        {post.comments}
                      </button>

                      <button className="flex items-center gap-2 hover:text-white transition text-sm">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
