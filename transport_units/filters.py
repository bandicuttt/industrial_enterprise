import django_filters

class DriversFilter(django_filters.FilterSet):
    is_active_choices = (
        ('true','Активные'),
        ('false','Не активные')
    )
    is_active = django_filters.ChoiceFilter(
        method = 'is_active_filter',
        choices = is_active_choices,
        label = 'is_active',
    )

    def is_active_filter(self, queryset, name, value):
        if value == 'true':
            return queryset.filter(user__is_active=True)
        return queryset.filter(user__is_active=False)