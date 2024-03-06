'''
from django.http import HttpResponse
from .openaiIntegration import generate_response


def api_view(request):
    # Example usage in a view
    prompt = "Once upon a time"
    ai_response = generate_response(prompt)
    print("AI Response:", ai_response)  # Print the AI response to the terminal
    return HttpResponse("AI Response printed to terminal")

'''

from django.http import JsonResponse
from .openaiIntegration import generate_response

def api_view(request):
    prompt = "what is your name?"
    ai_response = generate_response(prompt)
    # Return AI response as JSON
    return JsonResponse({'ai_response': ai_response})