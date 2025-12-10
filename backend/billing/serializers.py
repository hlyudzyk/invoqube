from rest_framework import serializers
from billing.models import Invoice, InvoiceItem, InvoiceAuditLog, Company


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'tax_id', 'address', 'is_active']


class InvoiceItemSerializer(serializers.ModelSerializer):
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = InvoiceItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'total']


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    can_edit = serializers.BooleanField(read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'issue_date', 'due_date', 'status',
            'company', 'company_name', 'items', 'total_amount', 'can_edit',
            'created_at', 'updated_at'
        ]


class InvoiceAuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = InvoiceAuditLog
        fields = [
            'id', 'action', 'timestamp', 'changes', 'old_values', 'new_values',
            'description', 'user_name', 'user_email'
        ]
