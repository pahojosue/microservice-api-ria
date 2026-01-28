# app/services.py
from sqlalchemy.orm import Session
from typing import Tuple, Optional
from . import models

def detect_department(db: Session, symptoms: str) -> Tuple[Optional[int], float]:
    """
    Detect department based on symptoms keywords.
    Returns (department_id, confidence) or (None, 0.0) if no match.
    """
    # Get all departments with their keyword mappings
    departments = db.query(models.Department).all()
    
    if not departments:
        return None, 0.0
    
    # Prepare symptoms for matching (lowercase, split into words)
    symptom_words = set(symptoms.lower().split())
    
    best_match = None
    best_confidence = 0.0
    
    for department in departments:
        if not department.keyword_mappings:
            continue
            
        # Calculate confidence based on keyword matches
        confidence = 0.0
        for keyword, weight in department.keyword_mappings.items():
            if keyword.lower() in symptom_words:
                confidence += weight
        
        # Normalize confidence (cap at 1.0)
        confidence = min(confidence, 1.0)
        
        if confidence > best_confidence:
            best_confidence = confidence
            best_match = department.id
    
    # Return result if confidence is above threshold
    if best_confidence >= 0.3:  # 30% threshold
        return best_match, best_confidence
    
    return None, 0.0

# If you have a more sophisticated service, keep it but ensure it returns department_id