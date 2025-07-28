# 🧪 Data Alchemist

> Transform your data chaos into organized insights

A powerful AI-enabled Next.js web application that helps organizations manage, validate, and optimize their resource allocation data. Built to solve the dreaded "spreadsheet chaos" problem with intelligent data processing and business rule management.

## ✨ Features

### 📊 Data Management
- **Multi-format Support**: Upload CSV, XLSX, or JSON files
- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **Real-time Validation**: 14+ validation rules with instant error detection
- **Inline Editing**: Click any cell to edit data with live validation

### 🔍 Smart Search & AI
- **Natural Language Search**: "high priority clients", "workers with coding skills"
- **Advanced Filtering**: Filter by priority, skills, groups, duration
- **AI-Enhanced Parsing**: Intelligent header mapping and data recognition

### ⚙️ Business Rules Engine
- **6 Rule Types**: Co-Run, Slot Restriction, Load Limit, Phase Window, Pattern Match, Precedence
- **Visual Rule Builder**: Intuitive interface for creating complex business rules
- **Priority Management**: Set rule priorities and enable/disable rules

### ⚖️ Prioritization System
- **6 Allocation Criteria**: Priority Level, Task Fulfillment, Fairness, Workload Balance, Skill Match, Phase Efficiency
- **Multiple Interfaces**: Sliders, ranking, and preset profiles
- **Weight Calculations**: Real-time percentage calculations

### 📤 Export & Integration
- **Clean Data Export**: Separate CSV files for clients, workers, and tasks
- **Rules Configuration**: Comprehensive rules.json for downstream tools
- **Export Summary**: Detailed metadata and validation reports

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd data-alchemist-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### 1. Loading Data
- **Sample Data**: The app loads with 50 clients, 50 workers, and 60 tasks
- **Upload Files**: Click "Upload File" to add your own CSV/XLSX data
- **Drag & Drop**: Simply drag files onto the upload area

### 2. Data Validation
The app automatically validates your data for:
- ✅ Missing required columns
- ✅ Duplicate IDs
- ✅ Invalid data formats
- ✅ Cross-reference errors
- ✅ Skill coverage gaps
- ✅ Workload constraints

### 3. Natural Language Search
Try these search queries:
- `"high priority clients"` - Find priority 4-5 clients
- `"workers with coding skills"` - Find skilled developers
- `"tasks with duration > 2"` - Find long-duration tasks
- `"group A workers"` - Find workers in GroupA
- `"expert workers"` - Find high-qualification workers

### 4. Creating Business Rules

#### Co-Run Rules
- Select multiple tasks that must run together
- Perfect for dependent workflows

#### Slot Restrictions
- Limit available time slots for specific groups
- Control resource availability

#### Load Limits
- Set maximum workload per phase for worker groups
- Prevent worker burnout

#### Phase Windows
- Restrict tasks to specific phases
- Optimize scheduling

### 5. Setting Priorities
Choose from three interfaces:
- **Sliders**: Fine-tune individual criteria weights
- **Ranking**: Drag-and-drop priority ordering
- **Profiles**: Apply preset configurations

### 6. Exporting Data
Click "Export Data" to download:
- `clients.csv` - Clean client data
- `workers.csv` - Clean worker data  
- `tasks.csv` - Clean task data
- `rules.json` - Business rules configuration
- `summary.json` - Export metadata

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Data Processing**: PapaParse (CSV), XLSX, custom parsers
- **File Upload**: React Dropzone
- **Validation**: Custom validation engine
- **Export**: Browser-native file download

### Project Structure
```
data-alchemist-app/
├── components/
│   ├── DataGrid/          # Editable data tables
│   ├── FileUploader/      # File upload interface
│   ├── RuleBuilder/       # Business rules UI
│   └── Prioritization/    # Priority controls
├── utils/
│   ├── dataParser.ts      # Data parsing & validation
│   └── exportUtils.ts     # Export functionality
├── src/app/
│   └── page.tsx          # Main application
└── sample.json           # Sample data
```

## 📊 Data Schema

### Clients
```typescript
interface Client {
  ClientID: string;
  ClientName: string;
  PriorityLevel: number;        // 1-5
  RequestedTaskIDs: string;     // Comma-separated
  GroupTag: string;
  AttributesJSON: string;
}
```

### Workers
```typescript
interface Worker {
  WorkerID: string;
  WorkerName: string;
  Skills: string;               // Comma-separated
  AvailableSlots: string;       // JSON array
  MaxLoadPerPhase: number;
  WorkerGroup: string;
  QualificationLevel: number;   // 1-5
}
```

### Tasks
```typescript
interface Task {
  TaskID: string;
  TaskName: string;
  Category: string;
  Duration: number;             // Phases
  RequiredSkills: string;       // Comma-separated
  PreferredPhases: string;      // Range or array
  MaxConcurrent: number;
}
```

## 🔧 Configuration

### Validation Rules
The app includes 14+ validation rules:
1. Missing required columns
2. Duplicate IDs
3. Malformed data formats
4. Out-of-range values
5. Cross-reference errors
6. Skill coverage gaps
7. Workload constraints
8. Phase slot saturation
9. And more...







