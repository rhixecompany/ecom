from django.contrib import admin

from .models import *

admin.site.site_header = "Rhixecompany Admin"
admin.site.site_title = "Rhixecompany Admin Area"
admin.site.index_title = "Welcome to the Rhixecompany Admin area"

admin.site.register(Customer)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
