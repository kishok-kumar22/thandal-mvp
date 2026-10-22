/**
 * Business Rule: Allow multiple active or overdue loans per customer.
 * 
 * BUSINESS RULE, confirm with the product owner:
 * - When true: non-blocking advisory banner is displayed if customer already has an active loan.
 * - When false: blocking validation error prevents creating/disbursing a new loan for a customer
 *   who currently has an active or overdue loan.
 */
export const ALLOW_MULTIPLE_ACTIVE_LOANS = true;
