# Database Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                 │
│  ┌──────────────┐         ┌──────────────┐                    │
│  │  Login/      │         │   Project    │                     │
│  │  Signup UI   │         │   Library    │                     │
│  └──────┬───────┘         └──────┬───────┘                     │
│         │                        │                              │
└─────────┼────────────────────────┼──────────────────────────────┘
          │                        │
          │ Authentication         │ Project Management
          │                        │
          ▼                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS APPLICATION                          │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                  App Router (Client)                    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌───────────────┐        │   │
│  │  │ page.tsx │  │ AuthForm │  │ SavedProjects │        │   │
│  │  └────┬─────┘  └────┬─────┘  └───────┬───────┘        │   │
│  │       │             │                 │                 │   │
│  └───────┼─────────────┼─────────────────┼─────────────────┘   │
│          │             │                 │                     │
│          │             │                 │                     │
│  ┌───────┼─────────────┼─────────────────┼─────────────────┐   │
│  │       │  API Routes (Server)          │                 │   │
│  │       │             │                 │                 │   │
│  │       ▼             ▼                 ▼                 │   │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────────┐          │   │
│  │  │ NextAuth│  │  signup  │  │   projects   │          │   │
│  │  │[...next │  │ /route.ts│  │   /route.ts  │          │   │
│  │  │ auth]/  │  └────┬─────┘  └──────┬───────┘          │   │
│  │  │route.ts │       │               │                   │   │
│  │  └────┬────┘       │               │                   │   │
│  │       │            │               │                   │   │
│  │       │  ┌─────────┴───────────────┴────────┐          │   │
│  │       │  │      Mongoose Models             │          │   │
│  │       │  │  ┌──────────┐  ┌──────────┐     │          │   │
│  │       │  │  │   User   │  │ Project  │     │          │   │
│  │       │  │  │ Schema   │  │  Schema  │     │          │   │
│  │       │  │  └────┬─────┘  └────┬─────┘     │          │   │
│  │       │  └───────┼─────────────┼────────────┘          │   │
│  │       │          │             │                       │   │
│  └───────┼──────────┼─────────────┼───────────────────────┘   │
│          │          │             │                           │
│          │ JWT Auth │ Password    │ CRUD Operations           │
│          │          │ Hashing     │                           │
└──────────┼──────────┼─────────────┼───────────────────────────┘
           │          │             │
           ▼          ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MONGODB DATABASE                           │
│                                                                 │
│  ┌─────────────────────┐       ┌──────────────────────────┐   │
│  │  Users Collection   │       │  Projects Collection     │   │
│  │                     │       │                          │   │
│  │  • email (unique)   │       │  • userId (ref)          │   │
│  │  • name             │       │  • title                 │   │
│  │  • password (hash)  │       │  • prompt                │   │
│  │  • createdAt        │       │  • enhancedPrompt        │   │
│  │                     │       │  • analysis              │   │
│  │  Indexes:           │       │  • htmlCode              │   │
│  │  - email (unique)   │       │  • aiModel               │   │
│  │                     │       │  • provider              │   │
│  │                     │       │  • createdAt             │   │
│  │                     │       │  • updatedAt             │   │
│  │                     │       │                          │   │
│  │                     │       │  Indexes:                │   │
│  │                     │       │  - userId                │   │
│  │                     │       │  - userId + createdAt    │   │
│  └─────────────────────┘       └──────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. User Registration Flow

```
┌──────┐   Enter name,     ┌──────────┐   Hash password    ┌──────────┐
│      │   email, pass     │          │                    │          │
│ User ├──────────────────►│ AuthForm ├───────────────────►│  Signup  │
│      │                   │          │                    │   API    │
└──────┘                   └──────────┘                    └────┬─────┘
                                                                 │
                                                                 │ bcrypt.hash()
                                                                 ▼
                                                           ┌──────────┐
                                                           │  Create  │
                                                           │   User   │
                                                           │  Model   │
                                                           └────┬─────┘
                                                                │
                                                                │ save()
                                                                ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                     MongoDB                                  │
    │  Users: { email, name, password (hashed), createdAt }       │
    └──────────────────────────────────────────────────────────────┘
                                                                │
                                                                │ Auto-login
                                                                ▼
                                                           ┌──────────┐
                                                           │ NextAuth │
                                                           │  Session │
                                                           └──────────┘
```

### 2. User Login Flow

```
┌──────┐   Enter email,    ┌──────────┐   Credentials     ┌──────────┐
│      │   password        │          │                   │ NextAuth │
│ User ├──────────────────►│ AuthForm ├──────────────────►│   API    │
│      │                   │          │                   └────┬─────┘
└──────┘                   └──────────┘                        │
                                                               │ Find user
                                                               ▼
                                                         ┌──────────┐
                                                         │ MongoDB  │
                                                         │  Query   │
                                                         └────┬─────┘
                                                              │
                                                              │ Return user
                                                              ▼
                                                         ┌──────────┐
                                                         │ Compare  │
                                                         │ Password │
                                                         │ (bcrypt) │
                                                         └────┬─────┘
                                                              │
                                                              │ Valid?
                                                              ▼
                                                         ┌──────────┐
                                                         │ Generate │
                                                         │   JWT    │
                                                         │  Token   │
                                                         └────┬─────┘
                                                              │
                                                              │ Set session
                                                              ▼
                                                          [Logged In]
```

### 3. Save Project Flow

```
┌──────┐  Click "Save"    ┌────────────┐   Enter title   ┌──────────┐
│      │  Project         │            │                 │  Save    │
│ User ├─────────────────►│ PreviewPanel├────────────────►│  Dialog  │
│      │                  │            │                 └────┬─────┘
└──────┘                  └────────────┘                      │
                                                              │ Submit
                                                              ▼
    ┌────────────────────────────────────────────────────────────────┐
    │                        POST /api/projects                      │
    │  Body: {                                                       │
    │    title, prompt, enhancedPrompt, analysis,                   │
    │    htmlCode, aiModel, provider                                │
    │  }                                                             │
    └────────────────────────────────────────┬───────────────────────┘
                                             │
                                             │ Get session
                                             ▼
                                       ┌──────────┐
                                       │ NextAuth │
                                       │  Verify  │
                                       └────┬─────┘
                                            │
                                            │ userId
                                            ▼
                                       ┌──────────┐
                                       │  Create  │
                                       │ Project  │
                                       │  Model   │
                                       └────┬─────┘
                                            │
                                            │ save()
                                            ▼
    ┌────────────────────────────────────────────────────────────────┐
    │                          MongoDB                               │
    │  Projects: {                                                   │
    │    userId, title, prompt, enhancedPrompt, analysis,           │
    │    htmlCode, aiModel, provider, createdAt, updatedAt          │
    │  }                                                             │
    └────────────────────────────────────────────────────────────────┘
                                            │
                                            │ Return success
                                            ▼
                                    [Project Saved ✓]
```

### 4. Load Project Flow

```
┌──────┐   Click "Load"    ┌──────────────┐   projectId   ┌──────────┐
│      │                   │              │               │   GET    │
│ User ├──────────────────►│SavedProjects ├──────────────►│/projects │
│      │                   │              │               │  /[id]   │
└──────┘                   └──────────────┘               └────┬─────┘
                                                                │
                                                                │ Verify session
                                                                ▼
                                                          ┌──────────┐
                                                          │ NextAuth │
                                                          │  Check   │
                                                          └────┬─────┘
                                                               │
                                                               │ userId
                                                               ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                      MongoDB Query                           │
    │  Project.findOne({                                           │
    │    _id: projectId,                                           │
    │    userId: session.user.id  // Security: user isolation      │
    │  })                                                          │
    └────────────────────────────────┬─────────────────────────────┘
                                     │
                                     │ Return project
                                     ▼
                                ┌──────────┐
                                │  Set     │
                                │  State   │
                                │  in UI   │
                                └────┬─────┘
                                     │
                                     ▼
                          [Project Loaded in Preview]
```

### 5. List Projects Flow

```
┌──────┐  Click "My        ┌──────────┐   GET Request    ┌──────────┐
│      │  Projects"        │          │                  │   GET    │
│ User ├──────────────────►│  Header  ├─────────────────►│/projects │
│      │                   │          │                  └────┬─────┘
└──────┘                   └──────────┘                       │
                                                              │ Check session
                                                              ▼
                                                        ┌──────────┐
                                                        │ NextAuth │
                                                        └────┬─────┘
                                                             │
                                                             │ userId
                                                             ▼
    ┌────────────────────────────────────────────────────────────────┐
    │                      MongoDB Query                             │
    │  Project.find({ userId })                                      │
    │    .sort({ createdAt: -1 })                                   │
    │    .select('-htmlCode')  // Exclude large field for speed     │
    │    .lean()                                                     │
    └────────────────────────────────┬───────────────────────────────┘
                                     │
                                     │ Return projects[]
                                     ▼
                                ┌──────────┐
                                │  Render  │
                                │  List in │
                                │  Sidebar │
                                └──────────┘
                                     │
                                     ▼
                          [Project Library Displayed]
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Layer 1: Authentication                                        │
│  ┌────────────────────────────────────────────────────┐        │
│  │ NextAuth.js → JWT Token → Session Validation       │        │
│  └────────────────────────────────────────────────────┘        │
│                        ▼                                        │
│  Layer 2: Password Security                                    │
│  ┌────────────────────────────────────────────────────┐        │
│  │ bcryptjs → 10 Salt Rounds → One-Way Hash           │        │
│  └────────────────────────────────────────────────────┘        │
│                        ▼                                        │
│  Layer 3: User Isolation                                       │
│  ┌────────────────────────────────────────────────────┐        │
│  │ All queries filtered by userId from session        │        │
│  │ Users can ONLY access their own data               │        │
│  └────────────────────────────────────────────────────┘        │
│                        ▼                                        │
│  Layer 4: API Route Protection                                 │
│  ┌────────────────────────────────────────────────────┐        │
│  │ getServerSession() → Verify on every API call      │        │
│  │ Return 401 Unauthorized if no valid session        │        │
│  └────────────────────────────────────────────────────┘        │
│                        ▼                                        │
│  Layer 5: MongoDB Security                                     │
│  ┌────────────────────────────────────────────────────┐        │
│  │ Connection string in .env.local (not committed)    │        │
│  │ Unique email index (prevents duplicates)           │        │
│  │ TLS/SSL encryption in transit                      │        │
│  └────────────────────────────────────────────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App Layout (SessionProvider)
│
└── page.tsx (Main App)
    │
    ├── Header
    │   ├── Welcome Message
    │   ├── "My Projects" Button
    │   └── Logout Button
    │
    ├── Sidebar (conditional: showSaved)
    │   └── SavedProjects Component
    │       └── Project List
    │           ├── Project Card
    │           ├── Load Button
    │           └── Delete Button
    │
    └── Main Content
        │
        ├── PromptInput Component
        │   ├── AI Provider Selector
        │   ├── Model Selector
        │   ├── Prompt Textarea
        │   └── Generate Button
        │
        └── PreviewPanel Component
            ├── View Toggle (Preview/Code)
            ├── Save Project Button → Save Dialog
            ├── Copy Code Button
            ├── Download ZIP Button
            └── Content Area
                ├── iframe (preview mode)
                └── code view (code mode)
```

## Database Indexes

```
┌─────────────────────────────────────┐
│        Users Collection             │
├─────────────────────────────────────┤
│  • email (unique, ascending)        │  ← Fast login lookup
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      Projects Collection            │
├─────────────────────────────────────┤
│  • userId (ascending)               │  ← Fast user filter
│  • userId + createdAt (compound)    │  ← Fast sorted queries
│                                     │
└─────────────────────────────────────┘
```

## API Endpoints Map

```
/api
├── auth
│   ├── [...nextauth]
│   │   └── route.ts       → POST /api/auth/signin (login)
│   │                      → POST /api/auth/signout (logout)
│   │                      → GET  /api/auth/session (get session)
│   └── signup
│       └── route.ts       → POST /api/auth/signup (register)
│
├── generate
│   └── route.ts           → POST /api/generate (AI generation)
│
└── projects
    ├── route.ts           → GET  /api/projects (list user's projects)
    │                      → POST /api/projects (save new project)
    └── [id]
        └── route.ts       → GET    /api/projects/[id] (get project)
                           → PUT    /api/projects/[id] (update project)
                           → DELETE /api/projects/[id] (delete project)
```
