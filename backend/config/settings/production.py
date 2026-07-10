from .base import *

DEBUG = False


# Seguridad básica
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True


# HTTPS (las activaremos cuando tengamos dominio)
# SECURE_SSL_REDIRECT = True
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True


# Headers permitidos
SECURE_REFERRER_POLICY = "same-origin"
X_FRAME_OPTIONS = "DENY"