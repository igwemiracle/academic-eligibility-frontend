import * as React from "react";
import { HugeiconsIcon, HugeiconsIconProps } from "@hugeicons/react";
import {
  Home01Icon,
  DashboardSquare01Icon,
  GraduationCapIcon,
  Award01Icon,
  FileValidationIcon,
  BookOpen01Icon,
  UserGroupIcon,
  UserIcon,
  UserCheck01Icon,
  Calendar01Icon,
  Settings01Icon,
  HelpCircleIcon,
  InformationCircleIcon,
  PrinterIcon,
  Search01Icon,
  Sun01Icon,
  Moon01Icon,
  Clock01Icon,
  Time02Icon,
  SlidersHorizontalIcon,
  LockKeyIcon,
  Mail01Icon,
  Loading01Icon,
  CheckmarkCircle01Icon,
  CheckmarkBadge01Icon,
  Tick01Icon,
  AlertCircleIcon,
  Alert02Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Cancel01Icon,
  Menu01Icon,
  Logout01Icon,
  CircleIcon,
  CheckmarkSquare01Icon,
  File01Icon,
  File02Icon,
  Download01Icon,
  Upload01Icon,
  RefreshIcon,
  FilterIcon,
  ChartHistogramIcon,
  ShieldCheckIcon,
  Folder01Icon,
  Add01Icon,
  UserAdd01Icon,
  UserBlock01Icon,
  Key01Icon,
  Edit02Icon,
  Delete02Icon,
  FloppyDiskIcon,
  ChartIncreaseIcon,
  Layers01Icon,
  EyeIcon,
  EyeOffIcon,
} from "@hugeicons/core-free-icons";

export {
  HugeiconsIcon,
  Home01Icon,
  DashboardSquare01Icon,
  GraduationCapIcon,
  Award01Icon,
  FileValidationIcon,
  BookOpen01Icon,
  UserGroupIcon,
  UserIcon,
  UserCheck01Icon,
  Calendar01Icon,
  Settings01Icon,
  HelpCircleIcon,
  InformationCircleIcon,
  PrinterIcon,
  Search01Icon,
  Sun01Icon,
  Moon01Icon,
  Clock01Icon,
  Time02Icon,
  SlidersHorizontalIcon,
  LockKeyIcon,
  Mail01Icon,
  Loading01Icon,
  CheckmarkCircle01Icon,
  CheckmarkBadge01Icon,
  Tick01Icon,
  AlertCircleIcon,
  Alert02Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Cancel01Icon,
  Menu01Icon,
  Logout01Icon,
  CircleIcon,
  CheckmarkSquare01Icon,
  File01Icon,
  File02Icon,
  Download01Icon,
  Upload01Icon,
  RefreshIcon,
  FilterIcon,
  ChartHistogramIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeOffIcon,
};

export type IconProps = {
  className?: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
} & Omit<React.SVGAttributes<SVGSVGElement>, "strokeWidth">;

function createIcon(icon: any, displayName: string) {
  const Component = React.forwardRef<SVGSVGElement, IconProps>(
    ({ size = 20, className, strokeWidth, ...props }, ref) => {
      const sw = typeof strokeWidth === "string" ? parseFloat(strokeWidth) : strokeWidth;
      return React.createElement(HugeiconsIcon, {
        icon,
        size,
        className,
        ...(sw !== undefined && !isNaN(sw) ? { strokeWidth: sw } : {}),
        ref,
        ...props,
      } as any);
    }
  );
  Component.displayName = displayName;
  return Component;
}

// Lucide-compatible re-exports using Hugeicons
export const GraduationCap = createIcon(GraduationCapIcon, "GraduationCap");
export const LayoutDashboard = createIcon(DashboardSquare01Icon, "LayoutDashboard");
export const Home = createIcon(Home01Icon, "Home");
export const FileText = createIcon(File01Icon, "FileText");
export const Settings = createIcon(Settings01Icon, "Settings");
export const Users = createIcon(UserGroupIcon, "Users");
export const User = createIcon(UserIcon, "User");
export const UserCheck = createIcon(UserCheck01Icon, "UserCheck");
export const BarChart3 = createIcon(ChartHistogramIcon, "BarChart3");
export const BookOpen = createIcon(BookOpen01Icon, "BookOpen");
export const Calendar = createIcon(Calendar01Icon, "Calendar");
export const Award = createIcon(Award01Icon, "Award");
export const Sliders = createIcon(SlidersHorizontalIcon, "Sliders");
export const History = createIcon(Clock01Icon, "History");
export const Clock = createIcon(Time02Icon, "Clock");
export const LogOut = createIcon(Logout01Icon, "LogOut");
export const Menu = createIcon(Menu01Icon, "Menu");
export const ShieldCheck = createIcon(ShieldCheckIcon, "ShieldCheck");
export const Shield = createIcon(ShieldCheckIcon, "Shield");
export const ShieldAlert = createIcon(AlertCircleIcon, "ShieldAlert");
export const CheckCircle2 = createIcon(CheckmarkCircle01Icon, "CheckCircle2");
export const Check = createIcon(Tick01Icon, "Check");
export const AlertTriangle = createIcon(Alert02Icon, "AlertTriangle");
export const AlertCircle = createIcon(AlertCircleIcon, "AlertCircle");
export const AlertOctagon = createIcon(AlertCircleIcon, "AlertOctagon");
export const XCircle = createIcon(Cancel01Icon, "XCircle");
export const X = createIcon(Cancel01Icon, "X");
export const Info = createIcon(InformationCircleIcon, "Info");
export const HelpCircle = createIcon(HelpCircleIcon, "HelpCircle");
export const Lock = createIcon(LockKeyIcon, "Lock");
export const Mail = createIcon(Mail01Icon, "Mail");
export const Loader2 = createIcon(Loading01Icon, "Loader2");
export const ArrowRight = createIcon(ArrowRight01Icon, "ArrowRight");
export const ArrowUpRight = createIcon(ArrowRight01Icon, "ArrowUpRight");
export const ArrowLeft = createIcon(ArrowLeft01Icon, "ArrowLeft");
export const ChevronDown = createIcon(ArrowDown01Icon, "ChevronDown");
export const ChevronUp = createIcon(ArrowUp01Icon, "ChevronUp");
export const ArrowUp = createIcon(ArrowUp01Icon, "ArrowUp");
export const ChevronRight = createIcon(ArrowRight01Icon, "ChevronRight");
export const ChevronLeft = createIcon(ArrowLeft01Icon, "ChevronLeft");
export const Search = createIcon(Search01Icon, "Search");
export const Sun = createIcon(Sun01Icon, "Sun");
export const Moon = createIcon(Moon01Icon, "Moon");
export const Printer = createIcon(PrinterIcon, "Printer");
export const Download = createIcon(Download01Icon, "Download");
export const Upload = createIcon(Upload01Icon, "Upload");
export const RefreshCw = createIcon(RefreshIcon, "RefreshCw");
export const Filter = createIcon(FilterIcon, "Filter");
export const FileSpreadsheet = createIcon(FileValidationIcon, "FileSpreadsheet");
export const Circle = createIcon(CircleIcon, "Circle");
export const FolderSearch = createIcon(Folder01Icon, "FolderSearch");
export const Plus = createIcon(Add01Icon, "Plus");
export const UserPlus = createIcon(UserAdd01Icon, "UserPlus");
export const UserX = createIcon(UserBlock01Icon, "UserX");
export const KeyRound = createIcon(Key01Icon, "KeyRound");
export const Pencil = createIcon(Edit02Icon, "Pencil");
export const Trash2 = createIcon(Delete02Icon, "Trash2");
export const Save = createIcon(FloppyDiskIcon, "Save");
export const TrendingUp = createIcon(ChartIncreaseIcon, "TrendingUp");
export const Layers = createIcon(Layers01Icon, "Layers");
export const Eye = createIcon(EyeIcon, "Eye");
export const EyeOff = createIcon(EyeOffIcon, "EyeOff");
