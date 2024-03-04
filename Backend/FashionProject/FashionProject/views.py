from django.http import JsonResponse

def api_view(request):
    # Logic for your API endpoint
    return JsonResponse({'message': 'API CALLED: BACK-END CONNECTED TO FRONT-END'})
