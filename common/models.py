from django.db import models

class BaseTypeModel(models.Model):
    title = models.CharField(
        max_length=48,
    )

    def  __str__(self):
        return self.title


    class Meta:
        abstract=True
