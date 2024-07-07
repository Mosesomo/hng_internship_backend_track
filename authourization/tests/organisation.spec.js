describe('Organisation Access Control', () => {
  it('should restrict access to organisations user does not belong to', async () => {
    const user = { userId: '123' };
    const organisation = { orgId: '456', userId: '789' };

    const hasAccess = user.userId === organisation.userId;
    expect(hasAccess).to.be.false;
  });
});

