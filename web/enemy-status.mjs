// External adapter state remains independent of this modifier's stun count.
export const isEnemyStunned=e=>!!e.stunned||(e.arcaneStunCount||0)>0||(e.bladeDanceStunCount||0)>0;
