// Valid order status transitions
const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "returned"],
  delivered: ["returned"],
  cancelled: [],
  returned: [],
};

export function isValidStatusTransition(fromStatus: string, toStatus: string): boolean {
  const validNextStatuses = STATUS_TRANSITIONS[fromStatus] || [];
  return validNextStatuses.includes(toStatus);
}

export function getAllowedStatuses(currentStatus: string): string[] {
  return STATUS_TRANSITIONS[currentStatus] || [];
}

export function getStatusTransitions() {
  return STATUS_TRANSITIONS;
}
