from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt # nur für tests
from django.core.exceptions import ValidationError
from .models import Consignment, User
import json
from django.forms.models import model_to_dict


@csrf_exempt
def consignment_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    consignment = Consignment(
            goal_country_id=int(data["goal_country"]) if data.get("goal_country") else None,
            typ=data["typ"],
            weight=data.get("weight"),
            maxPackageSize=data.get("maxPackageSize"),
            contact= data.get("contact"),
            forbidden = bool(data.get("forbidden", False)),
            format=data.get("format"),
            fee=data.get("fee"),
            date=data["date"],
            titel=data["titel"],
            description=data.get("description", ""),
    )
    print("maxPackageSize:", data.get("maxPackageSize"))


    try:

        consignment.full_clean()
        consignment.save()

    except ValidationError as e:
        return JsonResponse(
            {"errors": e.message_dict or e.messages},
            status=400
        )

    return JsonResponse({"status": "ok", "id": consignment.id})

    #try:
       # sender = User.objects.get(id=data["sender_id"])

    

    #except User.DoesNotExist:
       # return JsonResponse({"error": "Sender not found"}, status=404)

    #except ValidationError as e:
       # return JsonResponse({"error": e.message_dict or e.messages}, status=400)

    #except KeyError as e:
   #     return JsonResponse({"error": f"Missing field: {e}"}, status=400)