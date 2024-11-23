
from django.apps import AppConfig

class YourAppNameConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mcoop_app'

    def ready(self):
        import mcoop_app.signals