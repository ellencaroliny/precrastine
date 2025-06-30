#!/usr/bin/env python3
"""
Script para executar o servidor Precrastine-se
"""

import os
from app import app, db, init_db

def main():
    """Função principal para iniciar o servidor"""
    
    # Carrega variáveis de ambiente se arquivo .env existir
    if os.path.exists('.env'):
        from dotenv import load_dotenv
        load_dotenv()
    
    # Inicializa o banco de dados
    with app.app_context():
        init_db()
    
    # Configurações do servidor
    host = os.environ.get('HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print("=" * 60)
    print("🚀 PRECRASTINE-SE BACKEND")
    print("=" * 60)
    print(f"📊 API disponível em: http://{host}:{port}/api")
    print(f"🔍 Health check: http://{host}:{port}/api/health")
    print(f"👤 Usuário demo: demo@precrastine.com / demo123")
    print(f"🛠️  Modo: {'Desenvolvimento' if debug else 'Produção'}")
    print("=" * 60)
    
    # Inicia o servidor
    app.run(
        host=host,
        port=port,
        debug=debug,
        threaded=True
    )

if __name__ == '__main__':
    main()