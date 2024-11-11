export interface ComponentType {
  id: string;
  type: 'model' | 'view' | 'controller';
  name: string;
  code: string;
  props?: Record<string, any>;
  methods?: string[];
  state?: Record<string, any>;
}

export interface NodeData {
  label: string;
  component: ComponentType;
  onCodeChange?: (code: string) => void;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}