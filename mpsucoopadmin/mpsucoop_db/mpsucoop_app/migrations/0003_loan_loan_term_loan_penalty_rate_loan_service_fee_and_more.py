# Generated by Django 5.1.1 on 2024-09-16 20:38

import django.db.models.deletion
from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mpsucoop_app', '0002_alter_ledger_transaction_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='loan',
            name='loan_term',
            field=models.PositiveIntegerField(default=15),
        ),
        migrations.AddField(
            model_name='loan',
            name='penalty_rate',
            field=models.DecimalField(decimal_places=2, default=2, max_digits=5),
        ),
        migrations.AddField(
            model_name='loan',
            name='service_fee',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name='loan',
            name='type',
            field=models.CharField(choices=[('Regular', 'Regular'), ('Emergency', 'Emergency')], default='Regular', max_length=10),
        ),
        migrations.AddField(
            model_name='payment',
            name='penalty',
            field=models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=15),
        ),
        migrations.AddField(
            model_name='payment',
            name='service_fee',
            field=models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=15),
        ),
        migrations.AlterField(
            model_name='loan',
            name='interest_rate',
            field=models.DecimalField(decimal_places=2, default=5, max_digits=5),
        ),
        migrations.AlterField(
            model_name='loan',
            name='loan_amount',
            field=models.DecimalField(decimal_places=2, max_digits=15),
        ),
        migrations.AlterField(
            model_name='loan',
            name='status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Paid', 'Paid')], max_length=10),
        ),
        migrations.AlterField(
            model_name='payment',
            name='payment_amount',
            field=models.DecimalField(decimal_places=2, max_digits=15),
        ),
        migrations.CreateModel(
            name='RepaymentSchedule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('due_date', models.DateField()),
                ('amount_due', models.DecimalField(decimal_places=2, max_digits=15)),
                ('amount_paid', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('balance_due', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('loan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='repayment_schedules', to='mpsucoop_app.loan')),
            ],
        ),
    ]
