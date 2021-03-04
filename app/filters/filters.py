# from  dateutil import parser
import locale
from decimal import Decimal


def datefilter(date, fmt=None):
	# date = parser.parse(date)
	native = date.replace(tzinfo=None)
	format = '%d/%m/%Y'
	return native.strftime(format)


def moneyfilter(value):
    # return "{:,.2f}".format(int(value))
    try:   
        locale.setlocale(locale.LC_ALL, 'pt_BR.utf8')
    except:
        locale.setlocale(locale.LC_ALL, '')
    value = Decimal(value)
    # loc = locale.localeconv()
    return locale.currency(value, grouping=True, symbol=None)