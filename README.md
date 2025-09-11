# Hospital Management System

A modern Next.js-based hospital management system migrated from the legacy PHP system. This application provides comprehensive patient management, hospital administration, and reporting capabilities.

## Features

### Core Functionality
- **Patient Registration & Management**: Complete patient registration with CRO number generation
- **Hospital Management**: Add and manage multiple hospitals
- **Doctor Management**: Maintain doctor profiles and specializations
- **Appointment Scheduling**: Time slot management and appointment booking
- **Reports & Analytics**: Daily revenue, appointment, and patient reports
- **User Authentication**: Role-based access control

### Key Features Migrated from PHP System
- CRO (Case Registration Office) number generation
- Patient categorization (General, Chiranjeevi, RGHS, RTA, etc.)
- Automatic amount calculation based on patient category
- Scan type selection and management
- Receipt generation and printing
- Console management for scan scheduling
- Revenue tracking and reporting

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL with mysql2 driver
- **Authentication**: NextAuth.js
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Date Handling**: date-fns

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hospital-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   - Create a MySQL database named `hospital_management`
   - Import the database schema:
   ```bash
   mysql -u root -p hospital_management < database.sql
   ```

4. **Configure environment variables**
   - Copy `.env.local` and update with your database credentials
   ```bash
   cp .env.local .env.local
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - Default login: username: `admin`, password: `admin123`

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── patients/      # Patient CRUD operations
│   │   ├── hospitals/     # Hospital management
│   │   └── doctors/       # Doctor management
│   ├── dashboard/         # Dashboard page
│   ├── patients/          # Patient management pages
│   ├── hospitals/         # Hospital management pages
│   ├── doctors/           # Doctor management pages
│   └── reports/           # Reports and analytics
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                  # Utility libraries
│   └── db.ts            # Database connection
└── types/               # TypeScript type definitions
```

## Database Schema

The system uses the following main tables:
- `patient_new`: Patient registration data
- `hospital`: Hospital information
- `doctor`: Doctor profiles
- `scan`: Available scan types and pricing
- `time_slot2`: Available time slots
- `console`: Scan scheduling and status
- `users`: User authentication

## API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create new patient

### Hospitals
- `GET /api/hospitals` - Get all hospitals
- `POST /api/hospitals` - Create new hospital

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create new doctor

## Key Features

### CRO Number Generation
The system automatically generates unique CRO (Case Registration Office) numbers in the format:
`VDC/DD-MM-YYYY/COUNT`

### Patient Categories
Supports various patient categories with automatic pricing:
- General (paid)
- Chiranjeevi (free)
- RGHS (free)
- RTA (free)
- OPD FREE (free)
- IPD FREE (free)
- BPL/POOR (free)
- Sn. CITIZEN (free)

### Responsive Design
The application is fully responsive and works on desktop, tablet, and mobile devices.

## Migration from PHP System

This Next.js application successfully migrates all core functionality from the legacy PHP system:

1. **Patient Registration**: Complete form with all fields from `patient_add.php`
2. **Patient Listing**: Table view similar to `patient_list.php`
3. **Hospital Management**: CRUD operations for hospitals
4. **Doctor Management**: Doctor profile management
5. **Reports**: Revenue and appointment reporting
6. **Database Schema**: Maintains compatibility with existing data structure

## Development

### Adding New Features
1. Create API routes in `src/app/api/`
2. Add page components in appropriate directories
3. Update types in `src/types/index.ts`
4. Add database operations using the connection pool

### Database Operations
Use the database connection pool from `src/lib/db.ts`:
```typescript
import db from '@/lib/db';

const [rows] = await db.execute('SELECT * FROM table_name');
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.