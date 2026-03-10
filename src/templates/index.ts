import type { Template } from '../types';
import { BOLD_TEMPLATE } from './bold';
import { COMPACT_TEMPLATE } from './compact';
import { DEFAULT_TEMPLATE } from './default';
import { ELEGANT_TEMPLATE } from './elegant';
import { MINIMAL_TEMPLATE } from './minimal';
import { MODERN_TEMPLATE } from './modern';

export const TEMPLATES: Template[] = [
  DEFAULT_TEMPLATE,
  MINIMAL_TEMPLATE,
  MODERN_TEMPLATE,
  COMPACT_TEMPLATE,
  BOLD_TEMPLATE,
  ELEGANT_TEMPLATE,
];

export { DEFAULT_TEMPLATE } from './default';
export { resolveTemplate } from './default';
