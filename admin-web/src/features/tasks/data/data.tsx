import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Circle,
  CheckCircle,
  AlertCircle,
  Timer,
  HelpCircle,
  CircleOff,
} from 'lucide-react'
import { type TFunction } from 'i18next'

export const taskLabelValues = ['bug', 'feature', 'documentation'] as const
export const taskStatusValues = [
  'backlog',
  'todo',
  'in progress',
  'done',
  'canceled',
] as const
export const taskPriorityValues = ['low', 'medium', 'high', 'critical'] as const

export function getTaskLabels(t: TFunction) {
  return [
    {
      value: 'bug',
      label: t('tasks.options.labels.bug'),
    },
    {
      value: 'feature',
      label: t('tasks.options.labels.feature'),
    },
    {
      value: 'documentation',
      label: t('tasks.options.labels.documentation'),
    },
  ]
}

export function getTaskStatuses(t: TFunction) {
  return [
    {
      label: t('tasks.options.statuses.backlog'),
      value: 'backlog' as const,
      icon: HelpCircle,
    },
    {
      label: t('tasks.options.statuses.todo'),
      value: 'todo' as const,
      icon: Circle,
    },
    {
      label: t('tasks.options.statuses.inProgress'),
      value: 'in progress' as const,
      icon: Timer,
    },
    {
      label: t('tasks.options.statuses.done'),
      value: 'done' as const,
      icon: CheckCircle,
    },
    {
      label: t('tasks.options.statuses.canceled'),
      value: 'canceled' as const,
      icon: CircleOff,
    },
  ]
}

export function getTaskPriorities(t: TFunction) {
  return [
    {
      label: t('tasks.options.priorities.low'),
      value: 'low' as const,
      icon: ArrowDown,
    },
    {
      label: t('tasks.options.priorities.medium'),
      value: 'medium' as const,
      icon: ArrowRight,
    },
    {
      label: t('tasks.options.priorities.high'),
      value: 'high' as const,
      icon: ArrowUp,
    },
    {
      label: t('tasks.options.priorities.critical'),
      value: 'critical' as const,
      icon: AlertCircle,
    },
  ]
}
