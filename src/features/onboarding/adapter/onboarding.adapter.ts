/**
 * Framework Guides & Adapter for SDK Onboarding.
 * Strictly adheres to Part III (Frontend Feature Structure: Adapter Role).
 */

import type { FrameworkSetupGuide, FrameworkTarget } from '../models/onboarding.model';

export const FRAMEWORK_GUIDES: Record<FrameworkTarget, FrameworkSetupGuide> = {
  python_sdk: {
    id: 'python_sdk',
    name: 'Python (Native SDK)',
    installCommand: 'pip install llm-observability-sdk',
    envSnippet: 'export LLM_OBS_API_KEY="obs_live_9481a8b27c109d"\nexport LLM_OBS_ENDPOINT="https://llm-obs-web-app-9664.web.app"',
    snippetCode: `from llm_obs import ObservabilityClient, trace_llm

client = ObservabilityClient()

@trace_llm(name="financial_analyst_call")
def generate_summary(prompt: str):
    # Your LLM call executes under OpenTelemetry W3C trace context
    return client.openai.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )`,
  },
  nodejs_sdk: {
    id: 'nodejs_sdk',
    name: 'Node.js / TypeScript',
    installCommand: 'npm install @observability/sdk-node',
    envSnippet: 'LLM_OBS_API_KEY="obs_live_9481a8b27c109d"\nLLM_OBS_ENDPOINT="https://llm-obs-web-app-9664.web.app"',
    snippetCode: `import { LLMObservability } from '@observability/sdk-node';

const obs = new LLMObservability({
  apiKey: process.env.LLM_OBS_API_KEY,
});

const trace = obs.startTrace({ name: 'agent_chat_stream' });
// Automatically wraps OpenAI, Anthropic, and LangChain`,
  },
  langchain: {
    id: 'langchain',
    name: 'LangChain & LangGraph',
    installCommand: 'pip install langchain-llm-obs',
    envSnippet: 'LANGCHAIN_TRACING_V2=true\nLLM_OBS_API_KEY="obs_live_9481a8b27c109d"',
    snippetCode: `from langchain_llm_obs import ObsCallbackHandler
from langchain_openai import ChatOpenAI

handler = ObsCallbackHandler(api_key="obs_live_9481a8b27c109d")
llm = ChatOpenAI(callbacks=[handler])
response = llm.invoke("Summarize Q3 earnings report")`,
  },
  llamaindex: {
    id: 'llamaindex',
    name: 'LlamaIndex (RAG)',
    installCommand: 'pip install llama-index-callbacks-llm-obs',
    envSnippet: 'LLM_OBS_API_KEY="obs_live_9481a8b27c109d"',
    snippetCode: `from llama_index.core import Settings
from llama_index_callbacks_llm_obs import ObsCallbackHandler

Settings.callback_manager.add_handler(ObsCallbackHandler())
# Chunks, vector distance & LLM responses automatically tracked`,
  },
  openai_wrapper: {
    id: 'openai_wrapper',
    name: 'OpenAI 1-Line Drop-in',
    installCommand: 'pip install llm-obs-openai',
    envSnippet: 'LLM_OBS_API_KEY="obs_live_9481a8b27c109d"',
    snippetCode: `from llm_obs_openai import wrap_openai
from openai import OpenAI

client = wrap_openai(OpenAI())
# Zero code changes required beyond wrapping the client`,
  },
};
