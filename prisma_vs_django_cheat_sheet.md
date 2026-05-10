# Prisma vs. Django ORM Cheat Sheet

| Action | Django ORM | Prisma ORM |
| :--- | :--- | :--- |
| **Get All** | `User.objects.all()` | `prisma.user.findMany()` |
| **Get One (PK)** | `User.objects.get(id=pk)` | `prisma.user.findUnique({ where: { id: pk } })` |
| **First Record** | `User.objects.first()` | `prisma.user.findFirst()` |
| **Filter** | `User.objects.filter(role='ADMIN')` | `prisma.user.findMany({ where: { role: 'ADMIN' } })` |
| **Exclude** | `User.objects.exclude(role='ADMIN')` | `prisma.user.findMany({ where: { NOT: { role: 'ADMIN' } } })` |
| **Limit** | `User.objects.all()[:10]` | `prisma.user.findMany({ take: 10 })` |
| **Offset** | `User.objects.all()[10:20]` | `prisma.user.findMany({ skip: 10, take: 10 })` |
| **Order By** | `User.objects.order_by('-created')` | `prisma.user.findMany({ orderBy: { createdAt: 'desc' } })` |
| **Select Fields** | `User.objects.only('email')` | `prisma.user.findMany({ select: { email: true } })` |

## Advanced Filtering

| Operator | Django | Prisma |
| :--- | :--- | :--- |
| **Greater Than** | `price__gt=10` | `price: { gt: 10 }` |
| **Less Than** | `price__lt=10` | `price: { lt: 10 }` |
| **Contains** | `name__icontains='toy'` | `name: { contains: 'toy', mode: 'insensitive' }` |
| **In List** | `id__in=[1, 2]` | `id: { in: ['u1', 'u2'] }` |
| **Is Null** | `field__isnull=True` | `field: null` |
| **OR Logic** | `Q(a=1) \| Q(b=2)` | `OR: [{ a: 1 }, { b: 2 }]` |

## Relationships

| Action | Django | Prisma |
| :--- | :--- | :--- |
| **Include Related** | `User.objects.select_related('profile')` | `prisma.user.findMany({ include: { profile: true } })` |
| **Reverse Include** | `User.objects.prefetch_related('posts')` | `prisma.user.findMany({ include: { posts: true } })` |
| **Deep Include** | `select_related('a__b__c')` | `include: { a: { include: { b: { include: { c: true } } } } }` |

## Mutations (Write Operations)

| Action | Django | Prisma |
| :--- | :--- | :--- |
| **Create** | `User.objects.create(email='...')` | `prisma.user.create({ data: { email: '...' } })` |
| **Update One** | `user.email = '...'; user.save()` | `prisma.user.update({ where: { id: 1 }, data: { email: '...' } })` |
| **Update Many** | `User.objects.filter(...).update(...)` | `prisma.user.updateMany({ where: { ... }, data: { ... } })` |
| **Delete One** | `user.delete()` | `prisma.user.delete({ where: { id: 1 } })` |
| **Delete Many** | `User.objects.filter(...).delete()` | `prisma.user.deleteMany({ where: { ... } })` |
| **Upsert** | `update_or_create()` | `prisma.user.upsert({ where: { ... }, update: { ... }, create: { ... } })` |

> [!TIP]
> In Prisma, the **`include`** and **`select`** options are mutually exclusive at the same level. If you want to use both, you have to nest the `select` inside the `include`.
