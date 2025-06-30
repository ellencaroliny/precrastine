from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import os
import uuid
import base64
from PIL import Image
import io

app = Flask(__name__)

# Configurações
app.config['SECRET_KEY'] = 'precrastine-se-secret-key-2024'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///precrastine.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Inicialização
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# Criar pasta de uploads
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'profiles'), exist_ok=True)

# Modelos do Banco de Dados
class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    photo = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    tasks = db.relationship('Task', backref='user', lazy=True, cascade='all, delete-orphan')
    life_areas = db.relationship('LifeArea', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'photo': self.photo,
            'createdAt': self.created_at.isoformat()
        }

class Task(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    completed = db.Column(db.Boolean, default=False)
    priority = db.Column(db.String(10), default='medium')  # low, medium, high
    category = db.Column(db.String(50), default='pessoal')
    due_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'completed': self.completed,
            'priority': self.priority,
            'category': self.category,
            'dueDate': self.due_date.isoformat() if self.due_date else None,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat(),
            'userId': self.user_id
        }

class LifeArea(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, default=5)
    color = db.Column(db.String(7), nullable=False)
    icon = db.Column(db.String(50), nullable=False)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'score': self.score,
            'color': self.color,
            'icon': self.icon,
            'lastUpdated': self.last_updated.isoformat(),
            'userId': self.user_id
        }

# Funções auxiliares
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}

def process_image(image_data):
    """Processa e redimensiona imagem para foto de perfil"""
    try:
        # Decodifica base64
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Redimensiona para 200x200
        image = image.resize((200, 200), Image.Resampling.LANCZOS)
        
        # Converte para RGB se necessário
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Salva como base64
        buffer = io.BytesIO()
        image.save(buffer, format='JPEG', quality=85)
        processed_image = base64.b64encode(buffer.getvalue()).decode()
        
        return f"data:image/jpeg;base64,{processed_image}"
    except Exception as e:
        print(f"Erro ao processar imagem: {e}")
        return None

def create_default_life_areas(user_id):
    """Cria áreas da vida padrão para um novo usuário"""
    default_areas = [
        {'id': 'health', 'name': 'Saúde', 'color': '#10B981', 'icon': 'Heart'},
        {'id': 'career', 'name': 'Carreira', 'color': '#3B82F6', 'icon': 'Briefcase'},
        {'id': 'relationships', 'name': 'Relacionamentos', 'color': '#EC4899', 'icon': 'Users'},
        {'id': 'finances', 'name': 'Finanças', 'color': '#F59E0B', 'icon': 'DollarSign'},
        {'id': 'personal', 'name': 'Desenvolvimento Pessoal', 'color': '#8B5CF6', 'icon': 'BookOpen'},
        {'id': 'leisure', 'name': 'Lazer', 'color': '#06B6D4', 'icon': 'Gamepad2'},
        {'id': 'family', 'name': 'Família', 'color': '#EF4444', 'icon': 'Home'},
        {'id': 'spirituality', 'name': 'Espiritualidade', 'color': '#84CC16', 'icon': 'Sun'},
    ]
    
    for area_data in default_areas:
        area = LifeArea(
            id=area_data['id'],
            name=area_data['name'],
            color=area_data['color'],
            icon=area_data['icon'],
            user_id=user_id
        )
        db.session.add(area)

# Rotas de Autenticação
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password') or not data.get('name'):
            return jsonify({'error': 'Email, senha e nome são obrigatórios'}), 400
        
        # Verifica se usuário já existe
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email já está em uso'}), 400
        
        # Cria novo usuário
        user = User(
            email=data['email'],
            name=data['name']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Cria áreas da vida padrão
        create_default_life_areas(user.id)
        db.session.commit()
        
        # Cria token JWT
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'success': True,
            'user': user.to_dict(),
            'token': access_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email e senha são obrigatórios'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Email ou senha incorretos'}), 401
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'success': True,
            'user': user.to_dict(),
            'token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rotas de Usuário
@app.route('/api/users/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        data = request.get_json()
        
        if data.get('name'):
            user.name = data['name']
        
        if data.get('email'):
            # Verifica se email já está em uso por outro usuário
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != user_id:
                return jsonify({'error': 'Email já está em uso'}), 400
            user.email = data['email']
        
        if data.get('photo'):
            processed_photo = process_image(data['photo'])
            if processed_photo:
                user.photo = processed_photo
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Rotas de Tarefas
@app.route('/api/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    try:
        user_id = get_jwt_identity()
        tasks = Task.query.filter_by(user_id=user_id).order_by(Task.created_at.desc()).all()
        
        return jsonify({
            'tasks': [task.to_dict() for task in tasks]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
@jwt_required()
def create_task():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or not data.get('title'):
            return jsonify({'error': 'Título é obrigatório'}), 400
        
        task = Task(
            title=data['title'],
            description=data.get('description', ''),
            priority=data.get('priority', 'medium'),
            category=data.get('category', 'pessoal'),
            user_id=user_id
        )
        
        if data.get('dueDate'):
            task.due_date = datetime.fromisoformat(data['dueDate'].replace('Z', '+00:00'))
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'task': task.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    try:
        user_id = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=user_id).first()
        
        if not task:
            return jsonify({'error': 'Tarefa não encontrada'}), 404
        
        data = request.get_json()
        
        if data.get('title') is not None:
            task.title = data['title']
        if data.get('description') is not None:
            task.description = data['description']
        if data.get('completed') is not None:
            task.completed = data['completed']
        if data.get('priority') is not None:
            task.priority = data['priority']
        if data.get('category') is not None:
            task.category = data['category']
        if data.get('dueDate') is not None:
            if data['dueDate']:
                task.due_date = datetime.fromisoformat(data['dueDate'].replace('Z', '+00:00'))
            else:
                task.due_date = None
        
        task.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'task': task.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    try:
        user_id = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=user_id).first()
        
        if not task:
            return jsonify({'error': 'Tarefa não encontrada'}), 404
        
        db.session.delete(task)
        db.session.commit()
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Rotas da Roda da Vida
@app.route('/api/life-areas', methods=['GET'])
@jwt_required()
def get_life_areas():
    try:
        user_id = get_jwt_identity()
        areas = LifeArea.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            'lifeAreas': [area.to_dict() for area in areas]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/life-areas/<area_id>', methods=['PUT'])
@jwt_required()
def update_life_area(area_id):
    try:
        user_id = get_jwt_identity()
        area = LifeArea.query.filter_by(id=area_id, user_id=user_id).first()
        
        if not area:
            return jsonify({'error': 'Área da vida não encontrada'}), 404
        
        data = request.get_json()
        
        if data.get('score') is not None:
            score = int(data['score'])
            if 1 <= score <= 10:
                area.score = score
                area.last_updated = datetime.utcnow()
            else:
                return jsonify({'error': 'Pontuação deve estar entre 1 e 10'}), 400
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'lifeArea': area.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Rotas de Estatísticas
@app.route('/api/stats', methods=['GET'])
@jwt_required()
def get_stats():
    try:
        user_id = get_jwt_identity()
        
        # Estatísticas de tarefas
        total_tasks = Task.query.filter_by(user_id=user_id).count()
        completed_tasks = Task.query.filter_by(user_id=user_id, completed=True).count()
        
        today = datetime.now().date()
        today_tasks = Task.query.filter(
            Task.user_id == user_id,
            db.func.date(Task.due_date) == today
        ).count()
        
        high_priority_tasks = Task.query.filter_by(
            user_id=user_id, 
            priority='high', 
            completed=False
        ).count()
        
        # Estatísticas da roda da vida
        life_areas = LifeArea.query.filter_by(user_id=user_id).all()
        avg_life_score = sum(area.score for area in life_areas) / len(life_areas) if life_areas else 0
        
        return jsonify({
            'stats': {
                'totalTasks': total_tasks,
                'completedTasks': completed_tasks,
                'completionRate': round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0),
                'todayTasks': today_tasks,
                'highPriorityTasks': high_priority_tasks,
                'averageLifeScore': round(avg_life_score, 1)
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rota de saúde da API
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    }), 200

# Tratamento de erros
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint não encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Erro interno do servidor'}), 500

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({'error': 'Token expirado'}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({'error': 'Token inválido'}), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({'error': 'Token de acesso necessário'}), 401

# Inicialização do banco de dados
def init_db():
    """Inicializa o banco de dados com dados de demonstração"""
    db.create_all()
    
    # Verifica se já existe usuário demo
    demo_user = User.query.filter_by(email='demo@precrastine.com').first()
    if not demo_user:
        # Cria usuário demo
        demo_user = User(
            email='demo@precrastine.com',
            name='Usuário Demo'
        )
        demo_user.set_password('demo123')
        
        db.session.add(demo_user)
        db.session.commit()
        
        # Cria áreas da vida para o usuário demo
        create_default_life_areas(demo_user.id)
        
        # Cria algumas tarefas de exemplo
        sample_tasks = [
            {
                'title': 'Estudar Python',
                'description': 'Revisar conceitos de Flask e SQLAlchemy',
                'priority': 'high',
                'category': 'estudos'
            },
            {
                'title': 'Exercitar-se',
                'description': 'Caminhada de 30 minutos no parque',
                'priority': 'medium',
                'category': 'saude'
            },
            {
                'title': 'Reunião de equipe',
                'description': 'Discussão sobre o projeto Precrastine-se',
                'priority': 'high',
                'category': 'trabalho',
                'due_date': datetime.now() + timedelta(days=1)
            }
        ]
        
        for task_data in sample_tasks:
            task = Task(
                title=task_data['title'],
                description=task_data['description'],
                priority=task_data['priority'],
                category=task_data['category'],
                user_id=demo_user.id
            )
            if 'due_date' in task_data:
                task.due_date = task_data['due_date']
            
            db.session.add(task)
        
        db.session.commit()
        print("✅ Banco de dados inicializado com dados de demonstração")

if __name__ == '__main__':
    with app.app_context():
        init_db()
    
    print("🚀 Servidor Precrastine-se iniciado!")
    print("📊 API disponível em: http://localhost:5000/api")
    print("🔍 Health check: http://localhost:5000/api/health")
    print("👤 Usuário demo: demo@precrastine.com / demo123")
    
    app.run(debug=True, host='0.0.0.0', port=5000)