from dotenv import load_dotenv
load_dotenv()

import os
import uuid
import cloudinary
import cloudinary.uploader
import logging
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

ROOT_DIR = Path(__file__).parent
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

cloudinary.config(
    cloud_name=os.environ["CLOUDINARY_CLOUD_NAME"],
    api_key=os.environ["CLOUDINARY_API_KEY"],
    api_secret=os.environ["CLOUDINARY_API_SECRET"],
    secure=True,
)

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

JWT_ALGORITHM = "HS256"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# ---------------- Default content ----------------

DEFAULT_CONFIG: Dict[str, Any] = {
    "_id": "site",
    "identity": {
        "name": "Jakeline Safadinha",
        "username": "@jakelinesafadinha",
        "headline": "Meu lado que você não encontra em nenhum outro lugar.",
        "subheadline": "Prévias no FREE. Conteúdos exclusivos no VIP.",
        "ageNotice": "Conteúdo exclusivo para maiores de 18 anos",
        "heroImage": "https://images.pexels.com/photos/27428049/pexels-photo-27428049.jpeg",
        "logoText": "JS",
        "bio": "",
    },
    "theme": {
        "background": "#0A0508",
        "card": "#1A0B12",
        "accent": "#FF2A70",
        "gold": "#D4AF37",
        "rosa": "#B36B78",
        "text": "#FDF7F8",
        "textMuted": "#9A7B85",
        "whatsapp": "#25D366",
        "buttonText": "#FFFFFF",
    },
    "links": {
        "whatsappNumber": "5500000000000",
        "telegramFree": "https://t.me/seu_grupo_free",
        "instagram": "https://instagram.com/seu_perfil",
    },
    "whatsapp": {
        "floatingEnabled": True,
        "floatingText": "Falar com a Jakeline",
        "floatingPosition": "right",
        "messages": {
            "default": "Oi Jakeline! Vim pelo site e quero saber mais.",
            "diario": "Oi Jakeline! Quero saber como funciona o acesso VIP diário.",
            "semanal": "Oi Jakeline! Quero saber como funciona o acesso VIP semanal.",
            "mensal": "Oi Jakeline! Quero saber como funciona o acesso VIP mensal.",
            "promocao": "Oi Jakeline! Quero aproveitar a promoção do VIP.",
        },
    },
    "hero": {
        "ctaFree": "ENTRAR NO FREE",
        "ctaVip": "CONHECER O VIP",
        "vipAction": "scroll",
    },
    "socialProof": {
        "title": "Você não precisa acreditar só em mim.",
        "subtitle": "Veja a experiência dos meus assinantes.",
        "rating": "4.9",
        "totalReviews": "0",
        "distribution": [92, 5, 2, 1, 0],
    },
    "stats": [
        {"value": "+XXX", "label": "Assinantes"},
        {"value": "+XXX", "label": "Conteúdos"},
        {"value": "4.9/5", "label": "Avaliação média"},
        {"value": "+XXX", "label": "Clientes satisfeitos"},
    ],
    "free": {
        "title": "Quer conhecer primeiro?",
        "text": "Entra no meu grupo FREE, acompanha as prévias e conhece um pouco mais do meu conteúdo antes de decidir pelo VIP.",
        "image": "https://images.unsplash.com/photo-1671159593298-0025d7288d0c",
        "cta": "ENTRAR NO GRUPO FREE",
        "benefits": [
            "Prévias exclusivas toda semana",
            "Novidades em primeira mão",
            "Uma comunidade real e ativa"
        ],
    },
    "vip": {
        "title": "GRUPO VIP",
        "subtitle": "Meu espaço exclusivo para quem quer ter acesso ao conteúdo que não fica no FREE.",
        "benefits": [
            "Tem direito a Chamadinhas Comigo",
            "Conteúdos exclusivos",
            "Novas prévias",
            "Conteúdos que não publico no FREE",
            "Grupo privado no Telegram",
            "Atualizações frequentes",
            "Acesso através do bot",
            "Possibilidade de renovação",
            "Atendimento pelo WhatsApp",
        ],
    },
    "plans": [
        {
            "id": "diario",
            "name": "1 DIA",
            "price": "R$ 5,99",
            "oldPrice": "",
            "duration": "Acesso por 1 dia",
            "badge": "",
            "cta": "QUERO O DIÁRIO",
            "message": "Oi Jakeline! Quero saber como funciona o acesso VIP diário.",
            "highlighted": False,
            "active": True,
        },
        {
            "id": "semanal",
            "name": "7 DIAS",
            "price": "R$ 9,99",
            "oldPrice": "",
            "duration": "Acesso por 7 dias",
            "badge": "MAIS PROCURADO",
            "cta": "QUERO O SEMANAL",
            "message": "Oi Jakeline! Quero saber como funciona o acesso VIP semanal.",
            "highlighted": True,
            "active": True,
        },
        {
            "id": "mensal",
            "name": "30 DIAS",
            "price": "R$ 19,99",
            "oldPrice": "",
            "duration": "Acesso por 30 dias",
            "badge": "MELHOR VALOR",
            "cta": "QUERO O MENSAL",
            "message": "Oi Jakeline! Quero saber como funciona o acesso VIP mensal.",
            "highlighted": False,
            "active": True,
        },
    ],
    "promotion": {
        "enabled": False,
        "title": "OFERTA ESPECIAL",
        "subtitle": "Acesso VIP com desconto por tempo limitado",
        "oldPrice": "R$ 19,99",
        "newPrice": "R$ 14,99",
        "endsAt": "",
        "hideAfterExpiry": True,
        "cta": "QUERO A PROMOÇÃO",
    },
    "howItWorks": [
        {"n": "01", "text": "Escolha seu plano."},
        {"n": "02", "text": "Fale comigo pelo WhatsApp."},
        {"n": "03", "text": "Finalize seu acesso."},
        {"n": "04", "text": "Receba o acesso pelo Telegram."},
    ],
    "finalCta": {
        "title": "Agora você já sabe como funciona. Falta só decidir se quer ficar de fora.",
        "text": "Conheça o FREE ou fale comigo para liberar seu acesso VIP.",
        "ctaFree": "ENTRAR NO FREE",
        "ctaVip": "FALAR COM A JAKELINE",
    },
    "notifications": {
        "enabled": True,
        "position": "left",
        "duration": 4,
        "intervalMin": 20,
        "intervalMax": 45,
        "maxPerSession": 6,
        "templates": {
            "visit": "{online} pessoa(s) vendo esta página agora",
            "click_free": "Um visitante acabou de abrir o Grupo FREE",
            "click_whatsapp": "Um visitante chamou a Jakeline no WhatsApp",
            "click_vip": "Um visitante está conferindo os planos VIP",
            "click_plan": "Um visitante se interessou por um plano VIP",
        },
    },
    "previewsSettings": {
        "autoplay": True,
        "interval": 4,
        "perView": 3
    },
    "sections": [
        {"id": "hero", "label": "Hero", "visible": True},
        {"id": "social", "label": "Prova Social", "visible": True},
        {"id": "prints", "label": "Prints", "visible": True},
        {"id": "stats", "label": "Números", "visible": True},
        {"id": "free", "label": "Grupo FREE", "visible": True},
        {"id": "previews", "label": "Prévias", "visible": True},
        {"id": "vip", "label": "VIP", "visible": True},
        {"id": "plans", "label": "Planos", "visible": True},
        {"id": "promo", "label": "Promoção", "visible": True},
        {"id": "how", "label": "Como Funciona", "visible": True},
        {"id": "faq", "label": "FAQ", "visible": True},
        {"id": "cta", "label": "CTA Final", "visible": True},
        {"id": "footer", "label": "Rodapé", "visible": True},
    ],
}

SEED_TESTIMONIALS = [
    {
        "id": uuid.uuid4().hex,
        "name": "Exemplo 1",
        "username": "",
        "avatar": "https://images.unsplash.com/photo-1660619388291-ac5592bbdd57",
        "stars": 5,
        "date": "2026-07-01",
        "text": "PLACEHOLDER — substitua este depoimento por um real pelo painel administrativo.",
        "plan": "VIP Mensal",
        "isVip": True,
        "verified": False,
        "featured": True,
        "active": True,
        "order": 0,
    },
    {
        "id": uuid.uuid4().hex,
        "name": "Exemplo 2",
        "username": "",
        "avatar": "https://images.unsplash.com/photo-1627135542027-e46d6624cd29",
        "stars": 5,
        "date": "2026-07-02",
        "text": "PLACEHOLDER — substitua este depoimento por um real pelo painel administrativo.",
        "plan": "VIP Semanal",
        "isVip": True,
        "verified": False,
        "featured": False,
        "active": True,
        "order": 1,
    },
    {
        "id": uuid.uuid4().hex,
        "name": "Exemplo 3",
        "username": "",
        "avatar": "https://images.pexels.com/photos/11308988/pexels-photo-11308988.jpeg",
        "stars": 5,
        "date": "2026-07-03",
        "text": "PLACEHOLDER — substitua este depoimento por um real pelo painel administrativo.",
        "plan": "",
        "isVip": False,
        "verified": False,
        "featured": False,
        "active": True,
        "order": 2,
    },
    {
        "id": uuid.uuid4().hex,
        "name": "Exemplo 4",
        "username": "",
        "avatar": "https://images.unsplash.com/photo-1670601898837-98aa3efb9663",
        "stars": 4,
        "date": "2026-07-04",
        "text": "PLACEHOLDER — substitua este depoimento por um real pelo painel administrativo.",
        "plan": "VIP Diário",
        "isVip": True,
        "verified": False,
        "featured": False,
        "active": True,
        "order": 3,
    },
]

SEED_PRINTS = [
    {
        "id": uuid.uuid4().hex,
        "image": "https://images.pexels.com/photos/27413499/pexels-photo-27413499.jpeg",
        "title": "Exemplo de print",
        "caption": "PLACEHOLDER — suba um print real de conversa (oculte dados pessoais do cliente).",
        "date": "2026-07-01",
        "featured": True,
        "active": True,
        "order": 0,
    },
    {
        "id": uuid.uuid4().hex,
        "image": "https://images.unsplash.com/photo-1722834228772-01d16b9bf83b",
        "title": "Exemplo de print",
        "caption": "PLACEHOLDER — suba um print real de conversa (oculte dados pessoais do cliente).",
        "date": "2026-07-02",
        "featured": False,
        "active": True,
        "order": 1,
    },
]

SEED_PREVIEWS = [
    {
        "id": uuid.uuid4().hex,
        "image": "https://images.unsplash.com/photo-1679993813768-ca5ee0495991",
        "caption": "Prévia",
        "category": "editorial",
        "main": True,
        "active": True,
        "order": 0,
    },
    {
        "id": uuid.uuid4().hex,
        "image": "https://images.unsplash.com/photo-1625856198153-4723522a1c9b",
        "caption": "Prévia",
        "category": "editorial",
        "main": False,
        "active": True,
        "order": 1,
    },
    {
        "id": uuid.uuid4().hex,
        "image": "https://images.pexels.com/photos/13026741/pexels-photo-13026741.jpeg",
        "caption": "Prévia",
        "category": "editorial",
        "main": False,
        "active": True,
        "order": 2,
    },
    {
        "id": uuid.uuid4().hex,
        "image": "https://images.pexels.com/photos/17770843/pexels-photo-17770843.jpeg",
        "caption": "Prévia",
        "category": "editorial",
        "main": False,
        "active": True,
        "order": 3,
    },
    {
        "id": uuid.uuid4().hex,
        "image": "https://images.unsplash.com/photo-1767972463602-f5b562b8dbe8",
        "caption": "Prévia",
        "category": "editorial",
        "main": False,
        "active": True,
        "order": 4,
    },
]

SEED_FAQS = [
    {
        "id": uuid.uuid4().hex,
        "question": "Como funciona o acesso?",
        "answer": "Você escolhe um plano, fala comigo pelo WhatsApp, finaliza o pagamento e recebe o acesso ao grupo VIP pelo nosso bot no Telegram.",
        "active": True,
        "order": 0,
    },
    {
        "id": uuid.uuid4().hex,
        "question": "Como recebo meu acesso?",
        "answer": "Depois da confirmação, você recebe o acesso diretamente pelo bot no Telegram, de forma automática e segura.",
        "active": True,
        "order": 1,
    },
    {
        "id": uuid.uuid4().hex,
        "question": "Preciso ter Telegram?",
        "answer": "Sim. O grupo FREE e o grupo VIP ficam no Telegram, então você precisa de uma conta para acessar o conteúdo.",
        "active": True,
        "order": 2,
    },
    {
        "id": uuid.uuid4().hex,
        "question": "Posso entrar primeiro no FREE?",
        "answer": "Pode! O grupo FREE é aberto e gratuito. Lá você acompanha prévias e conhece meu conteúdo antes de decidir pelo VIP.",
        "active": True,
        "order": 3,
    },
    {
        "id": uuid.uuid4().hex,
        "question": "Qual a diferença entre FREE e VIP?",
        "answer": "No FREE você vê prévias e novidades. No VIP você tem acesso ao conteúdo completo e exclusivo, chamadinhas comigo e atualizações frequentes.",
        "active": True,
        "order": 4,
    },
    {
        "id": uuid.uuid4().hex,
        "question": "Como faço para renovar?",
        "answer": "É só me chamar no WhatsApp antes do fim do seu acesso e escolher o plano de renovação.",
        "active": True,
        "order": 5,
    },
    {
        "id": uuid.uuid4().hex,
        "question": "Como falar com a Jakeline?",
        "answer": "Pelo botão do WhatsApp aqui na página. O atendimento é feito diretamente comigo.",
        "active": True,
        "order": 6,
    },
    {
        "id": uuid.uuid4().hex,
        "question": "Quanto tempo demora para receber?",
        "answer": "Após a confirmação do pagamento, o acesso costuma ser liberado em poucos minutos pelo bot do Telegram.",
        "active": True,
        "order": 7,
    },
]

# ---------------- Auth ----------------

def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(
        plain.encode("utf-8"),
        hashed.encode("utf-8")
    )


def jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }

    return jwt.encode(
        payload,
        jwt_secret(),
        algorithm=JWT_ALGORITHM
    )


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "type": "refresh",
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }

    return jwt.encode(
        payload,
        jwt_secret(),
        algorithm=JWT_ALGORITHM
    )


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    auth = request.headers.get("Authorization", "")

    if not token and auth.startswith("Bearer "):
        token = auth[7:]

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    try:
        payload = jwt.decode(
            token,
            jwt_secret(),
            algorithms=[JWT_ALGORITHM]
        )

        if payload.get("type") != "access":
            raise HTTPException(
                status_code=401,
                detail="Invalid token type"
            )

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token expired"
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = await db.users.find_one({
        "_id": ObjectId(payload["sub"])
    })

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name", "Admin"),
        "role": user.get("role", "admin"),
    }


# ---------------- App ----------------

app = FastAPI()

api_router = APIRouter(prefix="/api")


class LoginInput(BaseModel):
    email: str
    password: str


class TrackInput(BaseModel):
    event_type: str
    target: Optional[str] = None
    referrer: Optional[str] = None


def clean(doc: dict) -> dict:
    doc = dict(doc)
    doc.pop("_id", None)
    return doc


# ---------------- Auth routes ----------------

@api_router.post("/auth/login")
async def login(
    data: LoginInput,
    request: Request,
    response: Response
):
    email = data.email.lower().strip()

    ip = request.client.host if request.client else "unknown"
    ident = f"{ip}:{email}"

    attempt = await db.login_attempts.find_one({
        "identifier": ident
    })

    if attempt and attempt.get("count", 0) >= 5:
        locked_until = attempt.get("locked_until")

        if (
            locked_until
            and datetime.fromisoformat(locked_until)
            > datetime.now(timezone.utc)
        ):
            raise HTTPException(
                status_code=429,
                detail="Muitas tentativas. Aguarde alguns minutos."
            )

    user = await db.users.find_one({
        "email": email
    })

    if (
        not user
        or not verify_password(
            data.password,
            user["password_hash"]
        )
    ):
        await db.login_attempts.update_one(
            {"identifier": ident},
            {
                "$inc": {"count": 1},
                "$set": {
                    "locked_until": (
                        datetime.now(timezone.utc)
                        + timedelta(minutes=15)
                    ).isoformat()
                },
            },
            upsert=True,
        )

        raise HTTPException(
            status_code=401,
            detail="E-mail ou senha incorretos"
        )

    await db.login_attempts.delete_one({
        "identifier": ident
    })

    access = create_access_token(
        str(user["_id"]),
        email
    )

    refresh = create_refresh_token(
        str(user["_id"])
    )

    response.set_cookie(
        "access_token",
        access,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=43200,
        path="/",
    )

    response.set_cookie(
        "refresh_token",
        refresh,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=604800,
        path="/",
    )

    return {
        "id": str(user["_id"]),
        "email": email,
        "name": user.get("name", "Admin"),
        "role": user.get("role", "admin"),
    }


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie(
        "access_token",
        path="/"
    )

    response.delete_cookie(
        "refresh_token",
        path="/"
    )

    return {"ok": True}


@api_router.get("/auth/me")
async def me(user=Depends(get_current_user)):
    return user


# ---------------- Public config ----------------

async def build_payload(active_only: bool) -> dict:
    cfg = await db.site_config.find_one({
        "_id": "site"
    })

    if not cfg:
        cfg = DEFAULT_CONFIG

    cfg = clean(cfg)

    query = {"active": True} if active_only else {}

    out = {
        "config": cfg
    }

    for key in (
        "testimonials",
        "prints",
        "previews",
        "faqs"
    ):
        items = await db[key].find(
            query
        ).sort(
            "order",
            1
        ).to_list(1000)

        out[key] = [
            clean(i)
            for i in items
        ]

    if active_only:
        out["config"]["plans"] = [
            p
            for p in cfg.get("plans", [])
            if p.get("active", True)
        ]

    return out


@api_router.get("/config")
async def public_config():
    return await build_payload(
        active_only=True
    )


# ---------------- Admin config ----------------

@api_router.get("/admin/config")
async def admin_config(
    user=Depends(get_current_user)
):
    return await build_payload(
        active_only=False
    )


@api_router.put("/admin/config")
async def update_config(
    payload: Dict[str, Any],
    user=Depends(get_current_user)
):
    payload = dict(payload)

    payload.pop("_id", None)

    await db.site_config.update_one(
        {"_id": "site"},
        {"$set": payload},
        upsert=True
    )

    return {"ok": True}


# ---------------- Upload ----------------

ALLOWED_EXT = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".svg"
}


@api_router.post("/admin/upload")
async def upload_image(
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    ext = Path(
        file.filename or ""
    ).suffix.lower()

    if ext not in ALLOWED_EXT:
        raise HTTPException(
            status_code=400,
            detail="Formato não suportado"
        )

    content = await file.read()

    if len(content) > 8 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Arquivo muito grande (máx 8MB)"
        )

    upload_result = cloudinary.uploader.upload(content, folder="jakelinepr1v", resource_type="image")

    return {
        "url": upload_result["secure_url"]
    }


# ---------------- Tracking / Activity / Analytics ----------------

@api_router.post("/track")
async def track(
    data: TrackInput,
    request: Request
):
    if data.event_type not in (
        "visit",
        "click"
    ):
        raise HTTPException(
            status_code=400,
            detail="Tipo inválido"
        )

    doc = {
        "event_type": data.event_type,
        "target": (data.target or "")[:60],
        "referrer": (data.referrer or "")[:300],
        "ip": (
            request.client.host
            if request.client
            else "unknown"
        ),
        "ua": request.headers.get(
            "user-agent",
            ""
        )[:300],
        "ts": datetime.now(
            timezone.utc
        ).isoformat(),
    }

    await db.events.insert_one(doc)

    return {"ok": True}


@api_router.get("/activity")
async def activity():
    now = datetime.now(timezone.utc)

    items = await db.events.find(
        {"event_type": "click"}
    ).sort(
        "ts",
        -1
    ).to_list(15)

    events = []

    for i in items:
        ts = datetime.fromisoformat(
            i["ts"]
        )

        events.append({
            "target": i.get("target") or "site",
            "minutes_ago": max(
                0,
                int(
                    (now - ts).total_seconds()
                    // 60
                )
            ),
        })

    online = await db.events.count_documents({
        "event_type": "visit",
        "ts": {
            "$gte": (
                now - timedelta(minutes=10)
            ).isoformat()
        }
    })

    return {
        "events": events,
        "online": max(online, 1)
    }


@api_router.get("/admin/analytics")
async def analytics(
    user=Depends(get_current_user)
):
    now = datetime.now(timezone.utc)

    total_visits = await db.events.count_documents({
        "event_type": "visit"
    })

    ips = await db.events.distinct(
        "ip",
        {"event_type": "visit"}
    )

    clicks = {}

    async for doc in db.events.aggregate([
        {
            "$match": {
                "event_type": "click"
            }
        },
        {
            "$group": {
                "_id": "$target",
                "count": {
                    "$sum": 1
                }
            }
        },
    ]):
        clicks[
            doc["_id"] or "outros"
        ] = doc["count"]

    plan_clicks = {
        k.replace("plan_", ""): v
        for k, v in clicks.items()
        if k.startswith("plan_")
    }

    most_clicked_plan = (
        max(
            plan_clicks,
            key=plan_clicks.get
        )
        if plan_clicks
        else None
    )

    referrers = []

    async for doc in db.events.aggregate([
        {
            "$match": {
                "referrer": {
                    "$nin": ["", None]
                }
            }
        },
        {
            "$group": {
                "_id": "$referrer",
                "count": {
                    "$sum": 1
                }
            }
        },
        {
            "$sort": {
                "count": -1
            }
        },
        {
            "$limit": 10
        },
    ]):
        referrers.append({
            "source": doc["_id"],
            "count": doc["count"]
        })

    since = (
        now - timedelta(days=13)
    ).replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    daily = {}

    async for doc in db.events.aggregate([
        {
            "$match": {
                "event_type": "visit",
                "ts": {
                    "$gte": since.isoformat()
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "$substr": [
                        "$ts",
                        0,
                        10
                    ]
                },
                "count": {
                    "$sum": 1
                }
            }
        },
    ]):
        daily[doc["_id"]] = doc["count"]

    days = [
        {
            "date": (
                since + timedelta(days=i)
            ).date().isoformat(),
            "count": daily.get(
                (
                    since + timedelta(days=i)
                ).date().isoformat(),
                0
            ),
        }
        for i in range(14)
    ]

    recent_docs = await db.events.find(
    ).sort(
        "ts",
        -1
    ).limit(
        25
    ).to_list(25)

    recent = [
        {
            "ip": r.get("ip"),
            "type": r.get("event_type"),
            "target": r.get("target"),
            "referrer": r.get("referrer"),
            "ts": r.get("ts"),
        }
        for r in recent_docs
    ]

    return {
        "totalVisits": total_visits,
        "uniqueVisitors": len(ips),
        "clicks": clicks,
        "mostClickedPlan": most_clicked_plan,
        "referrers": referrers,
        "daily": days,
        "recent": recent,
    }


# ---------------- Generic CRUD ----------------

RESOURCES = {
    "testimonials",
    "prints",
    "previews",
    "faqs"
}


@api_router.get("/admin/{resource}")
async def list_resource(
    resource: str,
    user=Depends(get_current_user)
):
    if resource not in RESOURCES:
        raise HTTPException(
            status_code=404,
            detail="Recurso não encontrado"
        )

    items = await db[resource].find(
    ).sort(
        "order",
        1
    ).to_list(1000)

    return [
        clean(i)
        for i in items
    ]


@api_router.post("/admin/{resource}")
async def create_resource(
    resource: str,
    payload: Dict[str, Any],
    user=Depends(get_current_user)
):
    if resource not in RESOURCES:
        raise HTTPException(
            status_code=404,
            detail="Recurso não encontrado"
        )

    payload = dict(payload)

    payload.pop("_id", None)
    payload.pop("id", None)

    payload["id"] = uuid.uuid4().hex

    payload.setdefault(
        "order",
        await db[resource].count_documents({})
    )

    payload.setdefault(
        "active",
        True
    )

    await db[resource].insert_one(
        payload
    )

    return clean(payload)


@api_router.put("/admin/{resource}/{item_id}")
async def update_resource(
    resource: str,
    item_id: str,
    payload: Dict[str, Any],
    user=Depends(get_current_user)
):
    if resource not in RESOURCES:
        raise HTTPException(
            status_code=404,
            detail="Recurso não encontrado"
        )

    payload = dict(payload)

    payload.pop("_id", None)

    payload["id"] = item_id

    result = await db[resource].update_one(
        {"id": item_id},
        {"$set": payload}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Item não encontrado"
        )

    return clean(payload)


@api_router.delete("/admin/{resource}/{item_id}")
async def delete_resource(
    resource: str,
    item_id: str,
    user=Depends(get_current_user)
):
    if resource not in RESOURCES:
        raise HTTPException(
            status_code=404,
            detail="Recurso não encontrado"
        )

    await db[resource].delete_one({
        "id": item_id
    })

    return {"ok": True}


# ---------------- Seed ----------------

async def seed_admin():
    email = os.environ.get(
        "ADMIN_EMAIL",
        "admin@example.com"
    ).lower()

    password = os.environ.get(
        "ADMIN_PASSWORD",
        "admin123"
    )

    existing = await db.users.find_one({
        "email": email
    })

    if existing is None:
        await db.users.insert_one({
            "email": email,
            "password_hash": hash_password(password),
            "name": "Jakeline",
            "role": "admin",
            "created_at": datetime.now(
                timezone.utc
            ).isoformat(),
        })

        logger.info(
            "Admin user seeded: %s",
            email
        )

    elif not verify_password(
        password,
        existing["password_hash"]
    ):
        await db.users.update_one(
            {"email": email},
            {
                "$set": {
                    "password_hash": hash_password(
                        password
                    )
                }
            }
        )


@app.on_event("startup")
async def startup():
    await db.users.create_index(
        "email",
        unique=True
    )

    await db.login_attempts.create_index(
        "identifier"
    )

    await db.events.create_index(
        "ts"
    )

    await seed_admin()

    if not await db.site_config.find_one({
        "_id": "site"
    }):
        await db.site_config.insert_one(
            DEFAULT_CONFIG
        )

        logger.info(
            "Default site config seeded"
        )

    for coll, seeds in (
        ("testimonials", SEED_TESTIMONIALS),
        ("prints", SEED_PRINTS),
        ("previews", SEED_PREVIEWS),
        ("faqs", SEED_FAQS),
    ):
        if await db[coll].count_documents({}) == 0:
            await db[coll].insert_many(
                [dict(s) for s in seeds]
            )

            logger.info(
                "Seeded %s",
                coll
            )


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


app.include_router(api_router)

app.mount(
    "/api/uploads",
    StaticFiles(
        directory=str(UPLOAD_DIR)
    ),
    name="uploads"
)


# ---------------- CORS ----------------

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.1.160:3000",
        "https://siteoficialjakelinepr1v.netlify.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)




