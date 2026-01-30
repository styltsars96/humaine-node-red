/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Decision = {
    /**
     * Event timestamp (sec, monotonic within a session)
     */
    't': number;
    /**
     * Agent/human identifier
     */
    agent?: (string | null);
    /**
     * 'human' | 'ai' (used by HCL, per-agent stats)
     */
    actor_type?: (string | null);
    /**
     * Free-text action label
     */
    action?: (string | null);
    /**
     * Action duration (sec)
     */
    duration_s?: (number | null);
    /**
     * Alternative latency (ms) if duration_s missing
     */
    latency_ms?: (number | null);
    /**
     * Outcome for Tr/A (True/False)
     */
    correct?: (boolean | null);
    /**
     * Primary/human prob. distribution over classes
     */
    probs?: (Record<string, number> | null);
    /**
     * Surrogate model prob. distribution
     */
    surrogate_probs?: (Record<string, number> | null);
    /**
     * Fallback if no probs; compare with action
     */
    surrogate_action?: (string | null);
    /**
     * Optional: e.g., 'error' marks an error event
     */
    event_type?: (string | null);
};

