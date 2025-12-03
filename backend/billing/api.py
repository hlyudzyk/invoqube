from django.http import JsonResponse
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404
from decimal import Decimal

from billing.models import Invoice, InvoiceItem, InvoiceAuditLog
from billing.serializers import InvoiceSerializer, InvoiceAuditLogSerializer


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def invoice_detail(request, invoice_id):
    """Get invoice details"""
    invoice = get_object_or_404(Invoice, id=invoice_id)
    serializer = InvoiceSerializer(invoice)
    return JsonResponse(serializer.data, safe=False)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def invoice_update(request, invoice_id):
    """Update invoice - only allowed for draft status"""
    invoice = get_object_or_404(Invoice, id=invoice_id)
    
    # Check if invoice can be edited
    if not invoice.can_edit():
        return JsonResponse({
            'error': 'Only draft invoices can be edited'
        }, status=403)
    
    # Store old values for audit log
    old_values = {
        'invoice_number': invoice.invoice_number,
        'issue_date': str(invoice.issue_date),
        'due_date': str(invoice.due_date),
        'status': invoice.status,
    }
    
    # Track changes
    changes = {}
    
    # Update invoice fields
    if 'invoice_number' in request.data and request.data['invoice_number'] != invoice.invoice_number:
        changes['invoice_number'] = {
            'old': invoice.invoice_number,
            'new': request.data['invoice_number']
        }
        invoice.invoice_number = request.data['invoice_number']
    
    if 'issue_date' in request.data and request.data['issue_date'] != str(invoice.issue_date):
        changes['issue_date'] = {
            'old': str(invoice.issue_date),
            'new': request.data['issue_date']
        }
        invoice.issue_date = request.data['issue_date']
    
    if 'due_date' in request.data and request.data['due_date'] != str(invoice.due_date):
        changes['due_date'] = {
            'old': str(invoice.due_date),
            'new': request.data['due_date']
        }
        invoice.due_date = request.data['due_date']
    
    invoice.save()
    
    # Update invoice items if provided
    if 'items' in request.data:
        # Store old items for audit
        old_items = list(invoice.items.values('id', 'description', 'quantity', 'unit_price'))
        
        # Clear existing items and create new ones
        invoice.items.all().delete()
        
        for item_data in request.data['items']:
            InvoiceItem.objects.create(
                invoice=invoice,
                description=item_data['description'],
                quantity=item_data['quantity'],
                unit_price=Decimal(str(item_data['unit_price']))
            )
        
        changes['items'] = {
            'old': old_items,
            'new': list(request.data['items'])
        }
    
    # Create audit log entry
    new_values = {
        'invoice_number': invoice.invoice_number,
        'issue_date': str(invoice.issue_date),
        'due_date': str(invoice.due_date),
        'status': invoice.status,
    }
    
    if changes:
        InvoiceAuditLog.objects.create(
            invoice=invoice,
            user=request.user,
            action='updated',
            old_values=old_values,
            new_values=new_values,
            changes=changes,
            description=f"Invoice updated by {request.user.name or request.user.email}"
        )
    
    serializer = InvoiceSerializer(invoice)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def invoice_audit_log(request, invoice_id):
    """Get audit log for an invoice"""
    invoice = get_object_or_404(Invoice, id=invoice_id)
    logs = invoice.audit_logs.all()
    serializer = InvoiceAuditLogSerializer(logs, many=True)
    return JsonResponse(serializer.data, safe=False)
