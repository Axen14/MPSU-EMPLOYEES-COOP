# Generated by Django 5.1.1 on 2024-09-16 12:09

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mpsucoop_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ledger',
            name='transaction_date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
