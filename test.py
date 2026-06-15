from openai import OpenAI

print("Creating client...")

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="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",
    timeout=30
)

print("Sending request...")

response = client.chat.completions.create(
    model="deepseek-ai/deepseek-v4-pro",
    messages=[
        {"role": "user", "content": "Hello"}
    ]
)

print("Received response!")
print(response.choices[0].message.content)