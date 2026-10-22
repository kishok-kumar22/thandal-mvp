import type { Agent } from "@/data/mockAgents";
import { getCashSummary, getAgentCashBalance } from "./cashbook";

/**
 * Calculates derived cash statistics for an agent from the append-only cashbook ledger.
 * No cash figures are stored in the Agent model.
 */
export function getAgentCashStats(agentId: string) {
  const summary = getCashSummary({ date: "2026-10-22", agentId });
  const cashInHand = getAgentCashBalance(agentId, "2026-10-22T23:59:59+05:30");

  return {
    cashCollected: summary.cashReceived,
    handedOver: summary.acceptedHandovers,
    cashInHand: cashInHand,
  };
}

export function getCashInHand(agent: Agent): number {
  return getAgentCashBalance(agent.id, "2026-10-22T23:59:59+05:30");
}
