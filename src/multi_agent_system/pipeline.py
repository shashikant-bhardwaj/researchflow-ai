from .agents import build_reader_agent, build_search_agent, writer_chain, critic_chain
import time



def invoke_with_retry(chain, inputs, max_attempts=3):
    for attempt in range(max_attempts):
        try:
            return chain.invoke(inputs)

        except Exception as error:
            status_code = getattr(error, "status_code", None)

            # Retry only for rate-limit errors
            if status_code != 429 and "429" not in str(error):
                raise

            if attempt == max_attempts - 1:
                raise

            wait_seconds = 10 * (attempt + 1)

            print(
                f"Rate limit reached. "
                f"Retrying in {wait_seconds} seconds..."
            )

            time.sleep(wait_seconds)

def run_research_pipeline(topic: str) -> dict:
    state = {}

    # step 1 - search agent

    #search agent working
    print("\n" + "="*50)
    print("step 1 - search agent is working ...")
    print("="*50)

    search_agent = build_search_agent()
    search_result = search_agent.invoke({
        "messages" : [("user", f"find recent, reliable and detailed information about: {topic}")]
    })
    state["search_result"] = search_result["messages"][-1].content

    print("\n search result ", state["search_result"])



# step 2 - reader agent working

    print("\n" + "="*50)
    print("step 2 - Reader agent is scraping top resources ...")
    print("="*50)

    reader_agent = build_reader_agent()
    reader_result = reader_agent.invoke({
        "messages": [("user", 
                      f"Based on the following search results about '{topic}',"
                      f"pick the most relevant URL and  scrape it for deeper content.\n\n"
                      f"Search Results: \n{state['search_result'][:800]}")]
    })

    state["scraped_content"] = reader_result['messages'][-1].content

    print("\n scraped content\n", state['scraped_content'])



# step 3 - writer chain
    print("\n" + "="*50)
    print("step 3 - writer is drafting the report ...")
    print("="*50)

    research_combined = (
    f"SEARCH RESULTS:\n"
    f"{state['search_result'][:10000]}\n\n"
    f"DETAILED SCRAPED CONTENT:\n"
    f"{state['scraped_content'][:15000]}"
)


    print("Research input characters:", len(research_combined))
    
    state['report'] = writer_chain.invoke({
        "topic": topic,
        "research": research_combined
    })
    print("Research input characters:", len(research_combined))

    print("\n Final Report\n", state['report'])


# step 4 - critic chain
    print("\n" + "="*50)
    print("step 4 - critic is reviewing the report ...")
    print("="*50)

    state["feedback"] = invoke_with_retry(
    critic_chain,
    {"report": state["report"]}
)

    print("\n critic report\n", state['feedback'])


    return state

if __name__ == "__main__":
    topic = input("\n Enter a research topic :")
    run_research_pipeline(topic)
   
    

  
    