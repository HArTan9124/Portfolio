import React from "react";
import {
  Brain,
  Database,
  ShieldCheck,
  Cpu,
  Smartphone,
  Activity,
  FileText,
  Award,
  Trophy,
  Terminal,
  Cloud,
  Leaf
} from "lucide-react";

interface IconMapperProps {
  name: string;
  className?: string;
}

export default function IconMapper({ name, className = "" }: IconMapperProps) {
  switch (name.toLowerCase()) {
    case "brain":
      return <Brain className={className} />;
    case "database":
      return <Database className={className} />;
    case "shield":
      return <ShieldCheck className={className} />;
    case "cpu":
      return <Cpu className={className} />;
    case "smartphone":
      return <Smartphone className={className} />;
    case "activity":
      return <Activity className={className} />;
    case "filetext":
      return <FileText className={className} />;
    case "award":
      return <Award className={className} />;
    case "trophy":
      return <Trophy className={className} />;
    case "terminal":
      return <Terminal className={className} />;
    case "cloud":
      return <Cloud className={className} />;
    case "leaf":
      return <Leaf className={className} />;
    default:
      return <Cpu className={className} />;
  }
}
