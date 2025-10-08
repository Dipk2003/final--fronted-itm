// Support Module Exports
export { default as ChatList } from './components/ChatList';
export { default as ChatWindow } from './components/ChatWindow';
export { default as KnowledgeBasePanel } from './components/KnowledgeBasePanel';
export { default as SLATrackingPanel } from './components/SLATrackingPanel';
export { default as SupportAnalytics } from './components/SupportAnalytics';
export { default as SupportDashboardTabs } from './components/SupportDashboardTabs';
export { default as SupportPage } from './components/SupportPage';
export { default as SupportStatsPanel } from './components/SupportStatsPanel';
export { default as SupportTicketForm } from './components/SupportTicketForm';
export { default as TicketManagement } from './components/TicketManagement';

// Services
export * from './services/supportApi';
// Note: chatApi is re-exported from shared/services - avoid duplicate exports
