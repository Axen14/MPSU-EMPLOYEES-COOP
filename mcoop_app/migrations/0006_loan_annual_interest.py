# Generated by Django 4.2.1 on 2024-11-28 11:17

from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mcoop_app', '0005_alter_loan_interest_rate_alter_loan_loan_period_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='loan',
            name='annual_interest',
            field=models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=5),
        ),
    ]