export interface WebCallResponse {
    call_id: string;
    web_call_link: string; 
    access_token: string;
    agent_id: string;
    call_status: "error" | "ongoing" | "ended" | "registered";
    call_type: "web_call";
    metadata?: Record<string, unknown>;
    transcript?: string;
    call_analysis?: {
        // Define any properties related to call analysis here
    };
}
