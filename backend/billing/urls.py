from django.urls import path
from billing.api import invoice_detail, invoice_update, invoice_audit_log

urlpatterns = [
    path('<int:invoice_id>/', invoice_detail, name='invoice_detail'),
    path('<int:invoice_id>/edit/', invoice_update, name='invoice_update'),
    path('<int:invoice_id>/audit-log/', invoice_audit_log, name='invoice_audit_log'),
]
