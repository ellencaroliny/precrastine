import base64
import io
from PIL import Image

def process_image(image_data, max_size=(200, 200), quality=85):
    """
    Processa e redimensiona imagem para foto de perfil
    
    Args:
        image_data (str): Dados da imagem em base64
        max_size (tuple): Tamanho máximo (largura, altura)
        quality (int): Qualidade da compressão JPEG
    
    Returns:
        str: Imagem processada em base64 ou None se erro
    """
    try:
        # Remove prefixo data:image se presente
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        # Decodifica base64
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Redimensiona mantendo proporção
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Converte para RGB se necessário
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Salva como JPEG em buffer
        buffer = io.BytesIO()
        image.save(buffer, format='JPEG', quality=quality, optimize=True)
        
        # Converte para base64
        processed_image = base64.b64encode(buffer.getvalue()).decode()
        
        return f"data:image/jpeg;base64,{processed_image}"
        
    except Exception as e:
        print(f"Erro ao processar imagem: {e}")
        return None

def create_default_life_areas(user_id):
    """
    Cria áreas da vida padrão para um novo usuário
    
    Args:
        user_id (str): ID do usuário
    
    Returns:
        list: Lista de objetos LifeArea criados
    """
    from models import LifeArea, db
    
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
    
    created_areas = []
    for area_data in default_areas:
        area = LifeArea(
            id=area_data['id'],
            name=area_data['name'],
            color=area_data['color'],
            icon=area_data['icon'],
            user_id=user_id
        )
        db.session.add(area)
        created_areas.append(area)
    
    return created_areas

def validate_task_data(data):
    """
    Valida dados de tarefa
    
    Args:
        data (dict): Dados da tarefa
    
    Returns:
        tuple: (is_valid, error_message)
    """
    if not data:
        return False, "Dados não fornecidos"
    
    if not data.get('title') or not data['title'].strip():
        return False, "Título é obrigatório"
    
    if len(data['title']) > 200:
        return False, "Título deve ter no máximo 200 caracteres"
    
    valid_priorities = ['low', 'medium', 'high']
    if data.get('priority') and data['priority'] not in valid_priorities:
        return False, f"Prioridade deve ser uma de: {', '.join(valid_priorities)}"
    
    return True, None

def validate_life_area_score(score):
    """
    Valida pontuação da área da vida
    
    Args:
        score: Pontuação a ser validada
    
    Returns:
        tuple: (is_valid, error_message, normalized_score)
    """
    try:
        score = int(score)
        if 1 <= score <= 10:
            return True, None, score
        else:
            return False, "Pontuação deve estar entre 1 e 10", None
    except (ValueError, TypeError):
        return False, "Pontuação deve ser um número inteiro", None