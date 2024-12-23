# Generated by Django 4.2.1 on 2024-11-28 20:02

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('mcoop_app', '0007_paymentschedule_service_fee_component'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='payment',
            name='admin_cost',
        ),
        migrations.RemoveField(
            model_name='payment',
            name='loan',
        ),
        migrations.RemoveField(
            model_name='payment',
            name='payment_amount',
        ),
        migrations.RemoveField(
            model_name='payment',
            name='payment_date',
        ),
        migrations.RemoveField(
            model_name='payment',
            name='penalty',
        ),
        migrations.AddField(
            model_name='payment',
            name='amount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name='payment',
            name='date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='payment',
            name='method',
            field=models.CharField(choices=[('Cash', 'Cash'), ('Bank Transfer', 'Bank Transfer')], max_length=50),
        ),
        migrations.AlterField(
            model_name='payment',
            name='payment_schedule',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payments', to='mcoop_app.paymentschedule'),
        ),
    ]
