from django.db import models
from django.core.exceptions import ValidationError


class User(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name
    
class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
    
class City(models.Model):
    name = models.CharField(max_length=100)
    country = models.ForeignKey(
        Country,
        on_delete=models.CASCADE,
        related_name="cities"
    )
    def __str__(self):
       return f"{self.name}, {self.country}"
    
class Consignment(models.Model):
    
    class Typ(models.TextChoices):
        LETTER = "LETTER", "Letter"
        PACKAGE = "PACKAGE", "Package"
    typ = models.CharField(
        max_length=10,
        choices=Typ.choices
    )
    weight = models.DecimalField(max_digits=10,
        decimal_places=3,
        null=True,
        blank=True)
    
    maxPackageSize = models.CharField(max_length=100, blank=True,default="")
    

    class Format(models.TextChoices):
        DIN_A3 = "A3", "DIN A3"
        DIN_A4 = "A4", "DIN A4"
        DIN_A5 = "A5", "DIN A5"
        
    format = models.CharField(
            max_length=2,
            choices=Format.choices,
            null=True,
            blank=True
        )
    fee = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True
    )
    date = models.DateField()

    titel = models.CharField(max_length=100, blank=True)

    contact = models.CharField(max_length=100, blank=True)

    forbidden = models.BooleanField(default=False)

    description = models.TextField(blank=True)

    sender= models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
         null=True,
         blank=True
    )
    start_country = models.ForeignKey(
        Country,
        on_delete=models.PROTECT,
        related_name="start_consignments",
        null=True,
        blank=True
    )

    goal_country = models.ForeignKey(
        Country,
        on_delete=models.PROTECT,
        related_name="goal_consignments",
        null=True,
        blank=True
    )
    start_city = models.ForeignKey(
    City,
    on_delete=models.PROTECT,
    related_name="start_consignments",
    null=True,
    blank=True
    )

    goal_city = models.ForeignKey(
        City,
        on_delete=models.PROTECT,
        related_name="goal_consignments",
        null=True,
        blank=True
    )
    def clean(self):
        """Business-Regeln validieren"""
        if self.typ == self.Typ.LETTER and not self.format:
            raise ValidationError("Letters must have a DIN format.")

        if self.typ == self.Typ.PACKAGE and self.format:
            raise ValidationError("Packages must not have a DIN format.")

        if self.typ == self.Typ.PACKAGE and not self.weight:
            raise ValidationError("Packages must have a weight.")

    def __str__(self):
        return f"{self.titel} ({self.typ})"
        
    
    



    








